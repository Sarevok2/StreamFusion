package com.musicstream.controller;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.musicstream.model.FolderListing;
import com.musicstream.service.FileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.net.URLDecoder;
import java.util.Random;

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

    @RequestMapping(value = "/playtrack", method = RequestMethod.GET)
    public @ResponseBody void playtrack(@RequestParam("fullpath") String fullpath, HttpServletRequest request, HttpServletResponse response) {
	    logger.debug("get " + fullpath);
        try {

	        String path = musicDir + fullpath.replace('$', '.');
            response.setContentType("audio/mpeg");
	        response.setHeader("Accept-Ranges", "bytes");

	        File songFile = new File(path);
	        long songFileLength = songFile.length();

	        String range = request.getHeader("Range");//bytes=2083256-
	        if (range == null || !range.matches("^bytes=\\d*-\\d*")) {// range is invalid
		        response.setHeader("Content-Range", "bytes */" + songFileLength);
		        response.sendError(HttpServletResponse.SC_REQUESTED_RANGE_NOT_SATISFIABLE);
		        return;
	        }
	        range = range.substring(6);
	        String[] splitRange = range.split("-");
	        long rangeStart = Long.valueOf(splitRange[0]);
	        long rangeEnd = (splitRange.length > 1) ? Long.valueOf(range.split("-")[1]) : (songFileLength-1);

	        String eTag = songFileLength + "_" + songFile.lastModified();
	        response.setHeader("ETag", eTag);
	        response.setDateHeader("Last-Modified", songFile.lastModified());
		    response.setHeader("Content-Range", "bytes " + rangeStart + "-" + rangeEnd + "/" + songFileLength);


	        response.setHeader("Content-Length", String.valueOf(rangeEnd-rangeStart+1));
	        response.setStatus(HttpServletResponse.SC_PARTIAL_CONTENT);
	        fileService.streamFileToOutput(songFile, response.getOutputStream(), rangeStart, rangeEnd);
        } catch (java.nio.file.NoSuchFileException e) {
            response.setStatus(HttpStatus.NOT_FOUND.value());
        } catch (IOException e) {
	        logger.debug("Client probably aborted " + e.getClass() + " " + e.getMessage());
        } catch(Exception e) {
            logger.debug("exception " + e.getMessage());
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        } finally {
	        try {
		        response.getOutputStream().close();
	        } catch (IOException e) {}
        }
    }


	@RequestMapping(value = "/folders", method = RequestMethod.GET, produces={MediaType.APPLICATION_JSON_VALUE})
	public @ResponseBody FolderListing directoryList(@RequestParam("directory") String directory) throws java.io.UnsupportedEncodingException {
		return fileService.getFolderListing(directory);
	}
}