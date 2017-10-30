package com.streamfusion.model;

import java.io.Serializable;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.Comparator.*;

public class Folder implements Serializable {
	List<Song> songs = new ArrayList<>();
	Map<String, Folder> folders = new LinkedHashMap<>();

	public List<Song> getSongs() {
		return songs;
	}

	public void addSong(Song song) {
		this.songs.add(song);
	}

	public Map<String, Folder> getFolders() {
		return folders;
	}

	public void addFolder(String name, Folder folder) {
		this.folders.put(name, folder);
	}

	public void sortAll() {
		folders = folders.entrySet().stream()
				.sorted(Map.Entry.comparingByKey())
				.collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,
						(oldValue, newValue) -> oldValue, LinkedHashMap::new));
		songs.sort(comparing(Song::getFileName));
	}
}
