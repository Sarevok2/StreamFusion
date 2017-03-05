package com.streamfusion.model;


import java.util.ArrayList;
import java.util.List;

public class FolderListing {
	private String baseDir;
	private List<String> folders;
	private List<Song> songs;

	public FolderListing() {
		baseDir = "";
		folders = new ArrayList<String>();
		songs = new ArrayList<Song>();
	}

	public List<String> getFolders() {
		return folders;
	}

	public List<Song> getSongs() {
		return songs;
	}

	public void addFolder(String folder) {
		folders.add(folder);
	}

	public void addFile(Song file) {
		songs.add(file);
	}

	public String getBaseDir() {
		return baseDir;
	}

	public void setBaseDir(String baseDir) {
		this.baseDir = baseDir;
	}
}

