package com.streamfusion.model;

import java.io.Serializable;
import java.util.*;

import static java.util.Comparator.*;

public class Folder implements Serializable {
	private String fileName;
	private List<Song> songs = new ArrayList<>();
	private List<Folder> folders = new ArrayList<>();

	public Folder(String fileName) {
		this.fileName = fileName;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public List<Song> getSongs() {
		return songs;
	}

	public void addSong(Song song) {
		this.songs.add(song);
	}

	public List<Folder> getFolders() {
		return folders;
	}

	public void addFolder(Folder folder) {
		this.folders.add(folder);
	}

	public void sortAll() {
		folders.sort(comparing(Folder::getFileName));
		songs.sort(comparing(Song::getFileName));
	}
}
