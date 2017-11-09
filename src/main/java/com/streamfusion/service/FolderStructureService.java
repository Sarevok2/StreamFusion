package com.streamfusion.service;

import com.streamfusion.config.AppConfig;
import com.streamfusion.model.Folder;
import com.streamfusion.model.Song;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FolderStructureService {
	private static final Logger logger = LoggerFactory.getLogger(SongStreamingService.class);

	private FileFilter fileFilter = new MusicFileFilter();

	@Autowired
	private SongTagScanningService songTagScanningService;

	@Autowired
	private ResourceLoader resourceLoader;

	@Autowired
	@Qualifier("rootMusicDirectory")
	private String rootMusicDirectory;

	@Autowired
	private Folder rootFolder;


	public Folder getFullFolderStructure() {
		return rootFolder;
	}

	@PostConstruct
	public void initFolderStructure() {
		try {
			List<Song> songsToScan = updateFolderStructure(rootFolder);
			songTagScanningService.scanSongs(songsToScan, rootFolder);
		} catch (IOException e) {
			logger.error("Failed to initialize folder structure: " + e.getMessage());
		}
	}

	private List<Song> updateFolderStructure(Folder rootFolder) throws IOException {
		Resource resource = resourceLoader.getResource("file:" + rootMusicDirectory );
		List<Song> songsToScan = new ArrayList<>();
		File folder = resource.getFile();
		updateFolder(folder, rootFolder, "", songsToScan);
		return songsToScan;
	}

	private void updateFolder(File newFolder, Folder oldFolder, String relativePath, List<Song> songsToScan) throws IOException {
		if (!newFolder.isDirectory()) {
			throw new IOException("file is not a directory");
		}
		File[] files = newFolder.listFiles(fileFilter);
		List<File> newSubFolders = Arrays.stream(files).filter(p -> p.isDirectory()).collect(Collectors.toList());
		List<File> newSongs = Arrays.stream(files).filter(p -> !p.isDirectory()).collect(Collectors.toList());
		for (File file : newSubFolders) {
			if (!oldFolder.getFolders().containsKey(file.getName())) {
				oldFolder.addFolder(file.getName(), new Folder());
			}
		}
		for (File file : newSongs) {
			if (!oldFolder.getSongs().stream().anyMatch(p -> p.getFileName().equals(file.getName()))) {
				Song newSong = new Song();
				newSong.setFileName(file.getName());
				newSong.setPath(relativePath);
				oldFolder.addSong(newSong);
			}
		}
		List<String> foldersToDelete = new ArrayList<>();
		for (String key: oldFolder.getFolders().keySet()) {
			Optional<File> newSubFolder = newSubFolders.stream().filter(p -> p.getName().equals(key)).findFirst();
			if (!newSubFolder.isPresent()) {
				foldersToDelete.add(key);
			} else {
				updateFolder(newSubFolder.get(), oldFolder.getFolders().get(key), relativePath + AppConfig.DIRECTORY_SEPARATOR + key, songsToScan);
			}
		}
		for (String folderToDelete: foldersToDelete) {
			oldFolder.getFolders().remove(folderToDelete);
		}
		List<Song> songsToDelete = new ArrayList<>();
		for (Song oldSong: oldFolder.getSongs()) {
			Optional<File> newSong = newSongs.stream().filter(p -> p.getName().equals(oldSong.getFileName())).findFirst();
			if (!newSong.isPresent()) {
				songsToDelete.add(oldSong);
			} else {
				if (oldSong.getLastModified() == null || (oldSong.getLastModified().getTime() < (newSong.get().lastModified() - 5000))) {
					songsToScan.add(oldSong);
				}
			}
		}
		for (Song songToDelete: songsToDelete) {
			oldFolder.getSongs().remove(songToDelete);
		}
		oldFolder.sortAll();
	}

	private static class MusicFileFilter implements FileFilter {
		private String[] extensions = {"mp3", "mp4", "m4a", "ogg"};

		@Override
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
