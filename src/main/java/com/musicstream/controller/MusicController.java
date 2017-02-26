package com.musicstream.controller;

import com.musicstream.model.FolderListing;
import com.musicstream.service.FileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;

@Controller
public class MusicController {

	private static final Logger logger = LoggerFactory.getLogger(MusicController.class);
	private static final String musicDir = "D:\\Music";
	private static final long DEFAULT_EXPIRE_TIME = 604800000L; //1 week.

	@Autowired
	private FileService fileService;

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public ModelAndView welcome() {
		logger.debug("index");
		ModelAndView model = new ModelAndView();
		model.setViewName("index");
		return model;
	}

	@RequestMapping(value = "/playtrack", method = RequestMethod.GET, produces = {MediaType.APPLICATION_OCTET_STREAM_VALUE})
	public
	@ResponseBody
	void playtrack(@RequestParam("fullpath") String fullpath, HttpServletRequest request, HttpServletResponse response) {
		logger.debug("get " + fullpath);
		try {
			String path = musicDir + fullpath.replace('$', '.');
			response.setContentType("audio/mpeg");
			response.setHeader("Accept-Ranges", "bytes");
			response.setHeader("Connection", "keep-alive");

			File songFile = new File(path);
			long songFileLength = songFile.length();

			String range = request.getHeader("Range");
			if (range == null || !range.matches("^bytes=\\d*-\\d*")) {// range is invalid
				response.setHeader("Content-Range", "bytes */" + songFileLength);
				response.sendError(HttpServletResponse.SC_REQUESTED_RANGE_NOT_SATISFIABLE);
				return;
			}
			range = range.substring(6);
			String[] splitRange = range.split("-");
			long rangeStart = Long.valueOf(splitRange[0]);
			long rangeEnd = (splitRange.length > 1) ? Long.valueOf(splitRange[1]) : (songFileLength - 1);
			long rangeLength = rangeEnd - rangeStart + 1;

			String eTag = songFileLength + "_" + songFile.lastModified();
			response.setHeader("ETag", eTag);
			response.setDateHeader("Last-Modified", songFile.lastModified());
			response.setHeader("Content-Range", "bytes " + rangeStart + "-" + rangeEnd + "/" + songFileLength);
			response.setHeader("Content-Length", String.valueOf(rangeLength));
			response.setStatus(HttpServletResponse.SC_PARTIAL_CONTENT);

			fileService.streamFileToOutput(songFile, response.getOutputStream(), rangeStart, rangeLength);
		} catch (java.nio.file.NoSuchFileException e) {
			logger.debug("Client probably aborted " + e.getClass() + " " + e.getMessage());
			response.setStatus(HttpStatus.NOT_FOUND.value());
		} catch (Exception e) {
			logger.debug("exception " + e.getMessage());
			e.printStackTrace();
			response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
		} finally {
			try {
				response.getOutputStream().close();
			} catch (IOException e) {
			}
		}
	}


	@RequestMapping(value = "/folders", method = RequestMethod.GET, produces = {MediaType.APPLICATION_JSON_VALUE})
	public
	@ResponseBody
	FolderListing directoryList(@RequestParam("directory") String directory) throws java.io.UnsupportedEncodingException {
		return fileService.getFolderListing(directory);
	}
}