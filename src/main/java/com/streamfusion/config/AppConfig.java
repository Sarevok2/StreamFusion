package com.streamfusion.config;

import com.streamfusion.model.Folder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

import javax.annotation.Resource;
import java.io.FileInputStream;
import java.io.ObjectInputStream;

@Configuration
@PropertySource("/resources/application.properties")
public class AppConfig {
	public static char DIRECTORY_SEPARATOR = '/';
	public static String INDEX_FILENAME = "StreamFusion.dat";

	private String indexFile = System.getProperty("user.home") + AppConfig.DIRECTORY_SEPARATOR + AppConfig.INDEX_FILENAME;

	@Resource
	private Environment env;

	@Bean(name="rootMusicDirectory")
	public String getRootMusicDirectory() {
		return env.getProperty("folder.music");
	}

	@Bean(name="indexFileName")
	public String getIndexFileName() {
		return indexFile;
	}

	@Bean
	public Folder getRootFolder() {
		try {
			FileInputStream fin = new FileInputStream(indexFile);
			ObjectInputStream ois = new ObjectInputStream(fin);
			return (Folder) ois.readObject();
		} catch (Exception ex) { //file does not exist
			return new Folder("");
		}
	}
}
