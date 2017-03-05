package com.streamfusion.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

import javax.annotation.Resource;

@Configuration
@PropertySource("/resources/application.properties")
public class AppConfig {

	@Resource
	private Environment env;

	@Bean
	public String getRootMusicDirectory() {
		return env.getProperty("folder.music");
	}
}
