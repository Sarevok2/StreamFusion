package com.streamfusion.service;

import com.streamfusion.config.AppConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.FileChannel;
import java.nio.channels.WritableByteChannel;
import java.nio.file.Files;
import java.nio.file.StandardOpenOption;

@Service
public class SongStreamingService {
	private static final Logger logger = LoggerFactory.getLogger(SongStreamingService.class);
	private static final int BUFFER_SIZE = 16384;

	@Autowired
	@Qualifier("rootMusicDirectory")
	private String rootMusicDirectory;

	private File songFile;

	public File loadFile(String path) {
		return songFile = new File(rootMusicDirectory + AppConfig.DIRECTORY_SEPARATOR + path);
	}

	public void streamFileToOutput(OutputStream output, long start, long length) throws IOException {
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
}
