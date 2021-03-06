package com.streamfusion.controller;

import com.streamfusion.model.Folder;
import com.streamfusion.service.SongStreamingService;
import com.streamfusion.service.FolderStructureService;
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

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;

@Controller
public class MusicController {

	private static final Logger logger = LoggerFactory.getLogger(MusicController.class);

	@Autowired
	private SongStreamingService songStreamingService;

	@Autowired
	private FolderStructureService folderStructureServicee;

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
		try (ServletOutputStream out = response.getOutputStream()){
			String path = fullpath.replace('$', '.');
			File songFile = songStreamingService.loadFile(path);
			long songFileLength = songFile.length();

			long rangeStart;
			long rangeEnd;
			String range = request.getHeader("Range");
			if (range == null || !range.matches("^bytes=\\d*-\\d*")) {// range is invalid
				/*response.sendError(HttpServletResponse.SC_REQUESTED_RANGE_NOT_SATISFIABLE);
				return;*/
				rangeStart = 0;
				rangeEnd = songFileLength - 1;
			} else {
				range = range.substring(6);
				String[] splitRange = range.split("-");
				rangeStart = Long.valueOf(splitRange[0]);
				rangeEnd = (splitRange.length > 1) ? Long.valueOf(splitRange[1]) : (songFileLength - 1);
			}
			long rangeLength = rangeEnd - rangeStart + 1;

			setResponseHeaders(response, songFileLength, songFile.lastModified(), rangeStart, rangeEnd, rangeLength);

			songStreamingService.streamFileToOutput(out, rangeStart, rangeLength);
		} catch (java.nio.file.NoSuchFileException e) {
			logger.debug("No such file exception " + e.getClass() + " " + e.getMessage());
			response.setStatus(HttpStatus.NOT_FOUND.value());
		} catch (Exception e) {
			logger.debug("exception " + e.getMessage());
			e.printStackTrace();
			response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
		}
	}


	@RequestMapping(value = "/folders", method = RequestMethod.GET, produces = {MediaType.APPLICATION_JSON_VALUE})
	public
	@ResponseBody
	Folder directoryList() throws java.io.UnsupportedEncodingException {
		return folderStructureServicee.getFullFolderStructure();
	}

	private void setResponseHeaders(HttpServletResponse response, long songFileLength, long lastModified, long rangeStart, long rangeEnd, long rangeLength) {
		response.setContentType("audio/mpeg");
		response.setHeader("Accept-Ranges", "bytes");
		response.setHeader("Connection", "keep-alive");

		String eTag = songFileLength + "_" + lastModified;
		response.setHeader("ETag", eTag);
		response.setDateHeader("Last-Modified", lastModified);
		response.setHeader("Content-Range", "bytes " + rangeStart + "-" + rangeEnd + "/" + songFileLength);
		response.setHeader("Content-Length", String.valueOf(rangeLength));
		response.setStatus(HttpServletResponse.SC_PARTIAL_CONTENT);
	}
}