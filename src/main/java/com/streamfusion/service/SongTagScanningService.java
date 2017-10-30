package com.streamfusion.service;

import com.mpatric.mp3agic.*;
import com.streamfusion.config.AppConfig;
import com.streamfusion.model.Folder;
import com.streamfusion.model.Song;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.util.Date;
import java.util.List;

@Service
public class SongTagScanningService {
	private static final Logger logger = LoggerFactory.getLogger(SongStreamingService.class);

	@Autowired
	@Qualifier("rootMusicDirectory")
	private String rootMusicDirectory;

	@Autowired
	@Qualifier("indexFileName")
	private String indexFileName;

	public void scanSongs(List<Song> songsToScan, Folder folder) {
		if (songsToScan.size() > 0) {
			SongScanner scanner = new SongScanner(songsToScan, folder);
			Thread worker = new Thread(scanner);
			worker.start();
		}
	}

	private void updateSong(Song song) throws IOException {
		try {
			logger.info("updating: " + song.getFileName());
			Mp3File mp3 = new Mp3File(rootMusicDirectory + AppConfig.DIRECTORY_SEPARATOR + song.getPath() + AppConfig.DIRECTORY_SEPARATOR + song.getFileName());
			song.setLastModified(new Date(mp3.getLastModified()));
			if (mp3.hasId3v2Tag()) {
				ID3v2 id3v2 = mp3.getId3v2Tag();
				song.setArtist(id3v2.getArtist());
				song.setAlbum(id3v2.getAlbum());
				song.setTitle(id3v2.getTitle());
				song.setTrack(id3v2.getTrack());
			} else if (mp3.hasId3v1Tag()) {
				ID3v1 id3v1 = mp3.getId3v1Tag();
				song.setArtist(id3v1.getArtist());
				song.setAlbum(id3v1.getAlbum());
				song.setTitle(id3v1.getTitle());
				song.setTrack(id3v1.getTrack());
			}
		} catch (UnsupportedTagException e) {
			logger.error("Unsupported tag: " + song.getFileName() + ", " + e.getMessage());
			throw new IOException(e);
		} catch (InvalidDataException e) {
			logger.error("Invalid Data: " + song.getFileName() + ", " + e.getMessage());
			throw new IOException(e);
		}
	}

	class SongScanner implements Runnable {
		private List<Song> songsToScan;
		private Folder folder;

		public SongScanner(List<Song> songsToScan, Folder folder) {
			this.songsToScan = songsToScan;
			this.folder = folder;
		}

		@Override
		public void run() {
			long startTime = System.currentTimeMillis();
			logger.info("Scan count: " + songsToScan.size());
			int count=0;
			for (Song song: songsToScan) {
				count++;
				try {
					updateSong(song);
				} catch (IOException e) {
					logger.error("Failed to update song: " + e.getMessage());
				}
			}
			saveFolderStructure(folder);
			logger.info("Time to scan songs: " + (System.currentTimeMillis() - startTime) + "ms, count: " + count);
		}
	}

	private void saveFolderStructure(Folder folder) {
		try {
			FileOutputStream fout = new FileOutputStream(indexFileName);
			ObjectOutputStream oos = new ObjectOutputStream(fout);
			oos.writeObject(folder);
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
	}
}
