package com.musicstream.service;

import com.musicstream.model.FolderListing;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

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
	private static String rootMusicDirectory = "file:D:/Music";
	public static char DIRECTORY_SEPARATOR = '/';
	public static char CLIENT_DIRECTORY_SEPARATOR = '$';
	private static final int BUFFER_SIZE = 1000;

	@Autowired
	private ResourceLoader resourceLoader;

	private FileFilter fileFilter = new MusicFileFilter();

	public FolderListing getFolderListing(String path) {
		FolderListing ret = new FolderListing();
		ret.setBaseDir(path);
		//Resource resource = resourceLoader.getResource(rootMusicDirectory + DIRECTORY_SEPARATOR + path.replace(CLIENT_DIRECTORY_SEPARATOR, DIRECTORY_SEPARATOR));
		Resource resource = resourceLoader.getResource(rootMusicDirectory + DIRECTORY_SEPARATOR + path);
		File[] files;
		try {
			files = resource.getFile().listFiles(fileFilter);
			if (files != null) {
				for (File file : files) {
					if (file.isDirectory()) {
						ret.addFolder(file.getName());
					} else {
						ret.addFile(file.getName());
					}
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return ret;
	}

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

	public void streamFileToOutput(File inputFile, OutputStream output, long start, long length) throws IOException {
		logger.debug("Length: " + length);
		try (FileChannel fileChannel = (FileChannel) Files.newByteChannel(inputFile.toPath(), StandardOpenOption.READ)) {
			WritableByteChannel outputChannel = Channels.newChannel(output);
			ByteBuffer buffer = ByteBuffer.allocateDirect(BUFFER_SIZE);
			long size = 0;

			while (fileChannel.read(buffer, start + size) != -1) {
				buffer.flip();

				if (size + buffer.limit() > length) {
					buffer.limit((int) (length - size));
				}
				logger.debug("Starting write: " + size + ", " + length);
				size += outputChannel.write(buffer);
				logger.debug("Done write: " + size + ", " + length);
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
}
