package com.streamfusion.model;


import java.util.ArrayList;
import java.util.List;

public class FolderListing {
	private String baseDir;
	private List<String> folders;
	private List<String> files;

	public FolderListing() {
		baseDir = "";
		folders = new ArrayList<String>();
		files = new ArrayList<String>();
	}

	public List<String> getFolders() {
		return folders;
	}

	public List<String> getFiles() {
		return files;
	}

	public void addFolder(String folder) {
		folders.add(folder);
	}

	public void addFile(String file) {
		files.add(file);
	}

	public String getBaseDir() {
		return baseDir;
	}

	public void setBaseDir(String baseDir) {
		this.baseDir = baseDir;
	}
}
