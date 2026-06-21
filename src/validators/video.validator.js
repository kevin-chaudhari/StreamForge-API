const videoExtensions = [".mpg", ".mp2", ".mpeg", ".mpe", ".mpv", ".mp4"];
const imageExtensions = [".gif", ".jpeg", ".png", ".jpg"];

/**
 * Checks whether a file path has a valid image extension.
 * @param {string} filePath - Local file path returned by multer.
 * @returns {boolean}
 */
const isImage = (filePath) => {
  if (!filePath) return false;
  return imageExtensions.some((ext) =>
    filePath.toLowerCase().endsWith(ext),
  );
};

/**
 * Checks whether a file path has a valid video extension.
 * @param {string} filePath - Local file path returned by multer.
 * @returns {boolean}
 */
const isVideo = (filePath) => {
  if (!filePath) return false;
  return videoExtensions.some((ext) =>
    filePath.toLowerCase().endsWith(ext),
  );
};

export { isVideo, isImage };
