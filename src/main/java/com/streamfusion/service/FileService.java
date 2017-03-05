package com.streamfusion.service;

import com.streamfusion.model.Song;
import com.streamfusion.model.FolderListing;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import com.mpatric.mp3agic.Mp3File;
import com.mpatric.mp3agic.ID3v1;
import com.mpatric.mp3agic.ID3v2;
import com.mpatric.mp3agic.InvalidDataException;
import com.mpatric.mp3agic.UnsupportedTagException;
import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.FileChannel;
import java.nio.channels.WritableByteChannel;
import java.nio.file.Files;
import java.nio.file.StandardOpenOption;


@Service
public class FileService {
	private static final Logger logger = LoggerFactory.getLogger(FileService.class);
	public static char DIRECTORY_SEPARATOR = '/';
	public static char CLIENT_DIRECTORY_SEPARATOR = '$';
	private static final int BUFFER_SIZE = 16384;

	@Autowired
	private String rootMusicDirectory;

	private File songFile;

	@Autowired
	private ResourceLoader resourceLoader;

	private FileFilter fileFilter = new MusicFileFilter();

	public FolderListing getFolderListing(String path) {
		FolderListing ret = new FolderListing();
		Resource resource = resourceLoader.getResource("file:" + rootMusicDirectory + DIRECTORY_SEPARATOR + path);
		File[] files;
		try {
			files = resource.getFile().listFiles(fileFilter);
			if (files != null) {
				for (File file : files) {
					if (file.isDirectory()) {
						ret.addFolder(file.getName());
					} else {
						try {
							Song audioFile = new Song();
							audioFile.setFileName(file.getName());
							audioFile.setPath(path);

							Mp3File mp3 = new Mp3File(file);
							if (mp3.hasId3v2Tag()) {
								ID3v2 id3v2 = mp3.getId3v2Tag();
								audioFile.setArtist(id3v2.getArtist());
								audioFile.setAlbum(id3v2.getAlbum());
								audioFile.setTitle(id3v2.getTitle());
								audioFile.setTrack(id3v2.getTrack());
							} else if (mp3.hasId3v1Tag()) {
								ID3v1 id3v1 = mp3.getId3v1Tag();
								audioFile.setArtist(id3v1.getArtist());
								audioFile.setAlbum(id3v1.getAlbum());
								audioFile.setTitle(id3v1.getTitle());
								audioFile.setTrack(id3v1.getTrack());
							}
							ret.addFile(audioFile);
						} catch (UnsupportedTagException e) {
							logger.error("Unsupported tag: " + file.getName() + ", " + e.getMessage());
						} catch (InvalidDataException e) {
							logger.error("Invalid Data: " + file.getName() + ", " + e.getMessage());
						}

					}
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return ret;
	}

	public File loadFile(String path) {
		return songFile = new File(rootMusicDirectory + DIRECTORY_SEPARATOR + path);
	}

	public void streamFileToOutput(OutputStream output, long start, long length) throws IOException {
		logger.debug("Length: " + length);
		try (FileChannel fileChannel = (FileChannel) Files.newByteChannel(songFile.toPath(), StandardOpenOption.READ)) {
			WritableByteChannel outputChannel = Channels.newChannel(output);
			ByteBuffer buffer = ByteBuffer.allocateDirect(BUFFER_SIZE);
			long size = 0;

			while (fileChannel.read(buffer, start + size) != -1) {
				buffer.flip();

				if (size + buffer.limit() > length) {
					buffer.limit((int) (length - size));
				}
				size += outputChannel.write(buffer);
				if (size >= length) {
					break;
				}

				buffer.clear();
			}
		}
	}

	/*public void streamMultipleFileToOutput(File[] inputFiles, OutputStream output, long start, long end) throws Exception {
		byte[] buffer = new byte[BUFFER_SIZE];
		int read, currentFileIndex = 0;
		long lengthCounter = 0, startPosition = -1;
		List<RandomAccessFile> input = new ArrayList<>();
		for (File file: inputFiles) {
			if (lengthCounter + file.length() < start) {
				currentFileIndex++;
				lengthCounter += file.length();
			} else {
				input.add(new RandomAccessFile(file, "r"));
				if (startPosition == -1) {
					startPosition = start - lengthCounter;
				}
			}

		}

		input.get(currentFileIndex).seek(startPosition);
		try {
			while(currentFileIndex < input.size()) {
				RandomAccessFile currentFile = input.get(currentFileIndex);
				while ((read = currentFile.read(buffer)) > 0) {
					output.write(buffer, 0, read);
				}
				currentFile.close();
				currentFileIndex++;
			}
		} finally {
			input.get(currentFileIndex).close();
		}
	}*/

	private static class MusicFileFilter implements FileFilter {
		private String[] extensions = {"mp3", "mp4", "m4a", "ogg"};

		public boolean accept(File file) {
			if (file.isDirectory()) {
				return true;
			} else {
				String path = file.getAbsolutePath().toLowerCase();
				for (int i = 0, n = extensions.length; i < n; i++) {
					String extension = extensions[i];
					if ((path.endsWith(extension) && (path.charAt(path.length()
							- extension.length() - 1)) == '.')) {
						return true;
					}
				}
			}
			return false;
		}
	}
}
