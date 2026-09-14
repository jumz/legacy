/* Copyright (C) 2019 Aware, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
 
/** @namespace
  */
var PhotoSetApi =
{
    /** Compliance result
     *  @enum {number} */
    MetricStatus : 
    (function()
    {
        var values = {};
        /** Compliance not computed */
        values[values.UNDETERMINED = 0] = "UNDETERMINED";

        /** Compliance passed */
        values[values.OK = 1] = "OK";

        /** Compliance failed, value too low */
        values[values.FAIL_LOW = 2] = "FAIL_LOW";

        /** Compliance failed, value too high */
        values[values.FAIL_HIGH = 3] = "FAIL_HIGH";

        /** Compliance failed, value not allowed */
        values[values.FAIL_VALUE = 4] = "FAIL_VALUE";

        return values;
    })(),

    /** Facial features.  All locations are from the subject's perspective.
     *  @enum {number} */
    FaceFeature : 
    (function()
    {
        var values = {};
        /** Location of the subject's left eye center . */
        values[values.LEFT_EYE_CENTER = 0] = "LEFT_EYE_CENTER";

        /** Location of the subject's right eye center. */
        values[values.RIGHT_EYE_CENTER = 1] = "RIGHT_EYE_CENTER";

        /** Location of the subject's nose tip. */
        values[values.NOSE_TIP = 2] = "NOSE_TIP";

        /** Location of the subject's mouth center. */
        values[values.MOUTH_CENTER = 3] = "MOUTH_CENTER";

        /** Location of the left side of the subject's head. */
        values[values.LEFT_SIDE = 4] = "LEFT_SIDE";

        /** Location of the right side of the subject's head. */
        values[values.RIGHT_SIDE = 5] = "RIGHT_SIDE";

        /** Location of the subject's chin tip. */
        values[values.CHIN_TIP = 6] = "CHIN_TIP";

        /** Location of the subject's head top. */
        values[values.HEAD_TOP = 7] = "HEAD_TOP";

        /** Location of the top left corner of the subject's face outline. */
        values[values.FACE_OUTLINE_TOP_LEFT = 8] = "FACE_OUTLINE_TOP_LEFT";

        /** Location of the top right corner of the subject's face outline. */
        values[values.FACE_OUTLINE_TOP_RIGHT = 9] = "FACE_OUTLINE_TOP_RIGHT";

        /** Location of the bottom left corner of the subject's face
         *  outline. */
        values[values.FACE_OUTLINE_BOTTOM_LEFT = 10] = "FACE_OUTLINE_BOTTOM_LEFT";

        /** Location of the bottom right corner of the subject's face
         *  outline. */
        values[values.FACE_OUTLINE_BOTTOM_RIGHT = 11] = "FACE_OUTLINE_BOTTOM_RIGHT";

        /** Location of the top left corner of the subject's head outline. */
        values[values.HEAD_OUTLINE_TOP_LEFT = 12] = "HEAD_OUTLINE_TOP_LEFT";

        /** Location of the top right corner of the subject's head outline. */
        values[values.HEAD_OUTLINE_TOP_RIGHT = 13] = "HEAD_OUTLINE_TOP_RIGHT";

        /** Location of the bottom left corner of the subject's head
         *  outline. */
        values[values.HEAD_OUTLINE_BOTTOM_LEFT = 14] = "HEAD_OUTLINE_BOTTOM_LEFT";

        /** Location of the bottom right corner of the subject's head
         *  outline. */
        values[values.HEAD_OUTLINE_BOTTOM_RIGHT = 15] = "HEAD_OUTLINE_BOTTOM_RIGHT";

        return values;
    })(),

    /** Image metrics
     *  @enum {number} */
    Metric : 
    (function()
    {
        var values = {};
        /** The width of the image measured in Pixels. */
        values[values.IMAGE_WIDTH = 1] = "IMAGE_WIDTH";

        /** The height of the image measured in Pixels. */
        values[values.IMAGE_HEIGHT = 2] = "IMAGE_HEIGHT";

        /** The number of color channels in the image. Valid values are 1
         *  for Grayscale and 3 for RGB. */
        values[values.NUMBER_CHANNELS = 3] = "NUMBER_CHANNELS";

        /** The distance between the left and right eye centers measured in
         *  Pixels. */
        values[values.EYE_SEPARATION = 4] = "EYE_SEPARATION";

        /** The location of the eye axis as a fraction of the image height
         *  up from the bottom. This is BB:B in the ISO standard. */
        values[values.EYE_AXIS_LOCATION_RATIO = 5] = "EYE_AXIS_LOCATION_RATIO";

        /** The location of the vertical centerline as a fraction of the
         *  image width measured from the left side of the image. This is
         *  AA:A in the ISO standard. */
        values[values.CENTERLINE_LOCATION_RATIO = 6] = "CENTERLINE_LOCATION_RATIO";

        /** The ratio of image height to image width. This is B:A in the ISO
         *  standard. */
        values[values.HEIGHT_TO_WIDTH_RATIO = 7] = "HEIGHT_TO_WIDTH_RATIO";

        /** The ratio of the image's width to the head's width. This is A:CC
         *  in the ISO standard. */
        values[values.IMAGE_WIDTH_TO_HEAD_WIDTH_RATIO = 8] = "IMAGE_WIDTH_TO_HEAD_WIDTH_RATIO";

        /** The ratio of the head's height to the image's height. This is
         *  DD:B in the ISO standard. */
        values[values.HEAD_HEIGHT_TO_IMAGE_HEIGHT_RATIO = 9] = "HEAD_HEIGHT_TO_IMAGE_HEIGHT_RATIO";

        /** The measurement of the subject's head's yaw angle in degrees.
         *  Negative value indicates the head is turned to the right.
         *  Positive value indicates the head is turned to the left. 
         *  Typical values range between -20 and +20 degrees. */
        values[values.POSE_ANGLE_YAW = 10] = "POSE_ANGLE_YAW";

        /** The measurement of the subject's head's pitch angle in degrees.
         *  Negative values indicate the head is tilted up. Positive values
         *  indicate the head is tilted down. Typical values range between
         *  -5 and +5 degrees. */
        values[values.POSE_ANGLE_PITCH = 11] = "POSE_ANGLE_PITCH";

        /** The extent to which the illumination of the image is not
         *  symmetrical. A score of 0 indicates symmetric illumination. A
         *  score of 100 indicates a high degree of asymmetry in
         *  illumination. Values less than or equal to 60 indicate the
         *  illumination is suitable and acceptable. Values greater than or
         *  equal to 80 indicate possible needs to re-capture images. */
        values[values.DEGREE_OF_ILLUMINATION_ASYMMETRY = 12] = "DEGREE_OF_ILLUMINATION_ASYMMETRY";

        /** The number of bits in the dynamic range of the facial region in
         *  the input image.\\There are 256 possible gray levels in typical
         *  images. Black is 0, white is 255 and all other graylevels are in
         *  between. Ideally, a face image will have graylevels that range
         *  from black (0) to white (255). In other words, you want a facial
         *  region to take full advantage of the graylevel range - it should
         *  have a full distribution of gray levels. For example, an image
         *  that is taken under low light levels will have a very small
         *  range of graylevels, e.g. black (0) up to some number well below
         *  255. On the other hand. an image that is taken under very bright
         *  conditions will also have a very small range of graylevels, but
         *  the darkest pixel might be significantly higher than 0 and many
         *  pixels might be saturated white (255). This distribution of gray
         *  levels is the dynamic range - the optimal dynamic range is 256
         *  (the total number of graylevels possible) in the facial region.
         *  For technical/historical reasons, this number is converted to a
         *  logarithm to the base 2, so 256 = 2**8 (2 to the exponent 8 is
         *  equal to 256) and the optimal range is 8.0. If the total number
         *  of graylevels is less than 256, say only 128, this number is 7.0
         *  since 2**7 = 128. A facial dynamic range that has a range of
         *  graylevels that is greater than 128 but less than 256 becomes
         *  some number between 7 and 8. The unit for dynamic range using
         *  this formula is bits.\\The ISO standard specifies that the
         *  minimum facial dynamic range should be 7 bits, or 128
         *  graylevels. Preface software outputs the dynamic range only in
         *  the facial region, as some number of bits, using the formula
         *  described above. \\Correctable values can be specified for this
         *  metric. When used in a profile they instruct the software to
         *  automatically attempt image enhancement if the dynamic range is
         *  in a certain range. Typically that range should be just below
         *  the acceptable range (e.g. 6.8 to 7.0), since you don't want
         *  enhancement to be applied if the image is very bad to begin
         *  with. */
        values[values.FACIAL_DYNAMIC_RANGE = 13] = "FACIAL_DYNAMIC_RANGE";

        /** The average luminance measured from the facial region. Good
         *  values are generally in the range from 25 to 75, however, this
         *  is also dependent on the Facial Dynamic Range. Low values
         *  indicate that the facial region may be too dark, while high
         *  values indicate the facial region may be too light. The
         *  correctable values can be specified in a profile. If this the
         *  correctable range is specified, auto-enhancement is attempted
         *  only if the facial brightness range is within the specified
         *  limits. */
        values[values.PERCENT_FACIAL_BRIGHTNESS = 14] = "PERCENT_FACIAL_BRIGHTNESS";

        /** The measure of how well the dynamic range is centered in the
         *  facial brightness distribution. Typical scores are in the range
         *  from 20 to 100. Optimal scores should be greater than or equal
         *  to 60. Scores less than 60 indicate that the facial region may
         *  be too dark. A score of 0 indicates that the facial region has
         *  too much saturated black. If a correctable range is specified,
         *  auto-enhancement is attempted only if the brightness score range
         *  is within the specified limits. */
        values[values.BRIGHTNESS_SCORE = 15] = "BRIGHTNESS_SCORE";

        /** The likelihood of a saturated coloring present in the subject's
         *  facial region. A score of 0 indicates that a saturated color was
         *  not detected. A score of 100 indicates that a saturated color
         *  was detected. */
        values[values.PERCENT_FACIAL_SATURATION = 16] = "PERCENT_FACIAL_SATURATION";

        /** The likelihood that the subject is smiling or has their mouth
         *  open. A score of 0 indicates that a smile has not been detected.
         *  A score of 100 indicates that a smile has been detected. */
        values[values.SMILE_LIKELIHOOD = 17] = "SMILE_LIKELIHOOD";

        /** The likelihood that there are shadows present on the subject's
         *  facial region. A score of 0 indicates that shadows have not been
         *  detected in the subject's facial region. A score of 100
         *  indicates shadows have been detected in the subject's facial
         *  region. */
        values[values.SHADOWS_LIKELIHOOD = 18] = "SHADOWS_LIKELIHOOD";

        /** The likelihood that the subject's face is in focus in the image.
         *  A score of 0 indicates that the subject's face was not detected
         *  as in focus. A score of 100 indicates a that the subject's face
         *  was detected as in focus. */
        values[values.FOCUS_LIKELIHOOD = 19] = "FOCUS_LIKELIHOOD";

        /** The measurement of how well high-frequency details appear on the
         *  subject's face. A score of 0 indicates a low level of
         *  high-frequency details detected. A score of 100 indicates a high
         *  level of high-frequency details detected. */
        values[values.SHARPNESS_LIKELIHOOD = 20] = "SHARPNESS_LIKELIHOOD";

        /** The likelihood of the presence of unnatural color in the
         *  subject's facial region. A score of 0 indicates a natural skin
         *  coloration was detected. A score of 100 indicates an unnatural
         *  skin color has been detected in the subject's facial region. */
        values[values.UNNATURAL_COLOR_LIKELIHOOD = 21] = "UNNATURAL_COLOR_LIKELIHOOD";

        /** The measurement of the subject's head's roll angle in degrees. A
         *  negative value indicates the head is rotated counter-clockwise.
         *  A positive value indicates the head is rotated clockwise. By
         *  default, faces are always corrected for roll when constructing
         *  an image. Specifying a correctable range will overrides this
         *  default behavior, so that users can prevent rotation correction
         *  by limiting the correctable range to e.g cMin=0 cMax=0. */
        values[values.EYE_AXIS_ANGLE = 22] = "EYE_AXIS_ANGLE";

        /** A measurement of how well the dynamic range is spread in eye
         *  regions of the subject. Scores of 60 or higher are adequate with
         *  higher scores being better. Scores of 40 or lower are considered
         *  to be inadequate. This value is often (though not necessarily)
         *  correlated with facial dynamic range. If a correctable range is
         *  specified in a Profile, auto-enhancement will be attempted
         *  during construction if the eye contrast range is within the
         *  specified limits. */
        values[values.EYE_CONTRAST = 23] = "EYE_CONTRAST";

        /** The likelihood of glasses present on the subject's face. A score
         *  of 0 indicates that glasses were not detected. A score of 100
         *  indicates that glasses were detected. */
        values[values.GLASSES_LIKELIHOOD = 24] = "GLASSES_LIKELIHOOD";

        /** The likelihood of tinted or dark lensed glasses present on the
         *  subjects face. If the subject was not detected wearing glasses,
         *  this score will return as 0. Otherwise, a score of 0 indicates
         *  that glasses with tinted or dark lenses were not detected. A
         *  score of 100 indicates that glasses with tinted or dark lenses
         *  were detected. */
        values[values.DARK_GLASSES_LIKELIHOOD = 25] = "DARK_GLASSES_LIKELIHOOD";

        /** The likelihood that a glare was present on the subject's
         *  glasses. If the subject was not detected wearing glasses, this
         *  score will return as 0. Otherwise, a score of 0 indicates that
         *  no glare was detected on the subject's glasses. A score of 100
         *  indicates that glare was detected on the subject's glasses. */
        values[values.GLARE_LIKELIHOOD = 26] = "GLARE_LIKELIHOOD";

        /** The likelihood that the subject is wearing glasses with a heavy
         *  frame. If the subject was not detected wearing glasses, this
         *  score will return as 0. Otherwise, a score of 0 indicates that
         *  glasses with heavy frames were not detected. A score of 100
         *  indicates that glasses with heavy frames were detected. */
        values[values.HEAVY_FRAMES_LIKELIHOOD = 27] = "HEAVY_FRAMES_LIKELIHOOD";

        /** The likelihood that the subject's right eye is obstructed by
         *  their glasses. If the subject was not detected wearing glasses
         *  or if the right eye was not detected as valid then this score
         *  will return as 0. Otherwise, a score of 0 indicates the that no
         *  obstruction was detected. A score of 100 indicates that an
         *  obstruction was detected. */
        values[values.FRAME_COVERED_RIGHT_EYE_LIKELIHOOD = 28] = "FRAME_COVERED_RIGHT_EYE_LIKELIHOOD";

        /** The likelihood that the subject's right eye is obstructed by
         *  their hair. If the subject's right eye was not detected as valid
         *  then this will return a score of 0.  Otherwise, a score of 0
         *  indicates that no obstruction was detected. A score of 100
         *  indicates that an obstruction was detected. */
        values[values.HAIR_COVERED_RIGHT_EYE_LIKELIHOOD = 29] = "HAIR_COVERED_RIGHT_EYE_LIKELIHOOD";

        /** The likelihood that the subject's right eye is closed. If the
         *  subject's right eye was not detected as valid then this will
         *  return a score of 0. Otherwise, a score of 0 indicates that the
         *  subject's right eye was detected as open. A score of 100
         *  indicates that the subject's right eye was detected as closed. */
        values[values.RIGHT_EYE_CLOSED_LIKELIHOOD = 30] = "RIGHT_EYE_CLOSED_LIKELIHOOD";

        /** The likelihood that the subject's right eye is visible. A score
         *  of 0 indicates the subject's right eye was not detected as
         *  visible. A score of 100 indicates the subject's right eye was
         *  detected as visible. The score returned by this metric affects
         *  the values of the Right Eye Obstructed by Glasses, Right Eye
         *  Obstructed by Hair, Right Eye Closed Metrics, and Off-Angle
         *  Gaze. */
        values[values.RIGHT_EYE_VALID_LIKELIHOOD = 31] = "RIGHT_EYE_VALID_LIKELIHOOD";

        /** The likelihood that the subject's left eye is obstructed by
         *  their glasses. If the subject was not detected wearing glasses
         *  or if the left eye was not detected as valid then this score
         *  will return as 0. Otherwise, a score of 0 indicates that no
         *  obstruction was detected. A score of 100 indicates that an
         *  obstruction was detected. */
        values[values.FRAME_COVERED_LEFT_EYE_LIKELIHOOD = 32] = "FRAME_COVERED_LEFT_EYE_LIKELIHOOD";

        /** The likelihood that the subject's left eye is obstructed by
         *  their hair. If the subject's left eye was not detected as valid
         *  then this will return a score of 0. Otherwise, a score of 0
         *  indicates that no obstructioned was detected. A score of 100
         *  indicates that an obstruction was detected. */
        values[values.HAIR_COVERED_LEFT_EYE_LIKELIHOOD = 33] = "HAIR_COVERED_LEFT_EYE_LIKELIHOOD";

        /** The likelihood that the subject's left eye is closed. If the
         *  subject's left eye was not detected as valid then this will
         *  return a score of 0. Otherwise, a score of 0 indicates the
         *  subject's left eye was detected as open. A score of 100
         *  indicates that the subject's left eye was detected as closed. */
        values[values.LEFT_EYE_CLOSED_LIKELIHOOD = 34] = "LEFT_EYE_CLOSED_LIKELIHOOD";

        /** The likelihood that the subject's left eye is visbile. A score
         *  of 0 indicates the subject's left eye was not detected as
         *  visibile. A score of 100 indicates the subject's left eye was
         *  detected as visibile.  The score returned by this metric affects
         *  the values of the Left Eye Obstructed by Glasses, Left Eye
         *  Obstructed by Hair, Left Eye Closed Metrics, and Off-Angle Gaze. */
        values[values.LEFT_EYE_VALID_LIKELIHOOD = 35] = "LEFT_EYE_VALID_LIKELIHOOD";

        /** The likelihood of the subject's eyes not directly looking at the
         *  camera. If either of the subject's eyes are not visible or
         *  obstructed then a score of 0 will be returned. Otherwise, a
         *  score of 0 indicates the subject's gaze was detected as being
         *  directed at the camera. A score of 100 indicates the subject's
         *  gaze was detected as not being directed at the camera. */
        values[values.OFF_ANGLE_GAZE_LIKELIHOOD = 36] = "OFF_ANGLE_GAZE_LIKELIHOOD";

        /** The likelihood that a subject was detected as having a Red-Eye
         *  effect in the image. A score of 0 indicates that the subject was
         *  not detected having a Red-Eye effect. A score of 100 indicates
         *  that the subject was detected as having a Red-Eye effect. */
        values[values.REDEYE_LIKELIHOOD = 37] = "REDEYE_LIKELIHOOD";

        /** The likelihood that the subject's forehead was detected as being
         *  obstructed by a hat or other covering. A score of 0 indicates
         *  that an obstruction or head covering was not detected. A score
         *  of 100 indicates that an obstruction or head covering was
         *  detected. */
        values[values.FOREHEAD_COVERING_LIKELIHOOD = 38] = "FOREHEAD_COVERING_LIKELIHOOD";

        /** The subject's estimated age based on facial analysis. */
        values[values.ESTIMATED_AGE = 39] = "ESTIMATED_AGE";

        /** The confidence that the subject is a child. A score of 0
         *  indicates no confidence in the subject being a child. A score of
         *  100 indicates a high confidence in the subject being a child. */
        values[values.AGE_CHILD_CONFIDENCE = 40] = "AGE_CHILD_CONFIDENCE";

        /** The confidence that the subject is a youth. A score of 0
         *  indicates no confidence in the subject being a youth. A score of
         *  100 indicates a high confidence in the subject being a youth. */
        values[values.AGE_YOUTH_CONFIDENCE = 41] = "AGE_YOUTH_CONFIDENCE";

        /** The confidence that the subject is an adult. A score of 0
         *  indicates no confidence in the subject being an adult. A score
         *  of 100 indicates a high confidence in the subject being an
         *  adult. */
        values[values.AGE_ADULT_CONFIDENCE = 42] = "AGE_ADULT_CONFIDENCE";

        /** The confidence that the subject is a senior. A score of 0
         *  indicates no confidence in the subject being a senior. A score
         *  of 100 indicates a high confidence in the subject being a
         *  senior. */
        values[values.AGE_SENIOR_CONFIDENCE = 43] = "AGE_SENIOR_CONFIDENCE";

        /** The confidence that the subject is a female. A score of 0
         *  indicates no confidence in the subject being a female. A score
         *  of 100 indicates a high confidence in the subject being a
         *  female. */
        values[values.FEMALE_CONFIDENCE = 44] = "FEMALE_CONFIDENCE";

        /** The confidence that the subject is a male. A score of 0
         *  indicates no confidence in the subject being a male. A score of
         *  100 indicates a high confidence in the subject being a male. */
        values[values.MALE_CONFIDENCE = 45] = "MALE_CONFIDENCE";

        /** The confidence that the subject is white. A score of 0 indicates
         *  no confidence in the subject being white. A score of 100
         *  indicates a high confidence in the subject being white. */
        values[values.RACE_WHITE_CONFIDENCE = 46] = "RACE_WHITE_CONFIDENCE";

        /** The confidence that the subject is black. A score of 0 indicates
         *  no confidence in the subject being black. A score of 100
         *  indicates a high confidence in the subject being black. */
        values[values.RACE_BLACK_CONFIDENCE = 47] = "RACE_BLACK_CONFIDENCE";

        /** The confidence that the subject is asian. A score of 0 indicates
         *  no confidence in the subject being asian. A score of 100
         *  indicates high confidence in the subject being asian. */
        values[values.RACE_ASIAN_CONFIDENCE = 48] = "RACE_ASIAN_CONFIDENCE";

        /** The level of gray detected in the background. Lower scores
         *  indicate lighter levels of gray detected. Higher scores indicate
         *  dark levels of gray detected. Lower scores are preferred over
         *  higher scores provided there is sufficient contrast between the
         *  background and the facial area. The optimal value is 18. */
        values[values.PERCENT_BACKGROUND_GRAY = 49] = "PERCENT_BACKGROUND_GRAY";

        /** The degree of color uniformity detected in the background of the
         *  image. A score of 0 indicates a non-uniform background was
         *  detected. A score of 100 indicates a uniform (single color)
         *  background was detected. */
        values[values.PERCENT_BACKGROUND_UNIFORMITY = 50] = "PERCENT_BACKGROUND_UNIFORMITY";

        /** The likelihood that the background is cluttered. A score of 0
         *  indicates no background clutter detected. A score of 100
         *  indicates a cluttered background was detected. */
        values[values.DEGREE_OF_CLUTTER = 51] = "DEGREE_OF_CLUTTER";

        /** The type of background detected. A score of 1 indicates a simple
         *  background was detected. A score of 2 indicates a complex
         *  background was detected. */
        values[values.BACKGROUND_TYPE = 52] = "BACKGROUND_TYPE";

        /** A measurement of the RGB Color Balancing in the background.  A
         *  balanced color is one with the same Red, Green, and Blue color
         *  channel values.  Lower scores indicate less color balance has
         *  been detected.  Higher scores indicate that more color balance
         *  has been detected. */
        values[values.PERCENT_COLOR_BALANCED = 53] = "PERCENT_COLOR_BALANCED";

        /** Specify the type of background padding used when performing
         *  Construction. Valid Values are:\\1 - Pad using pixels of the
         *  average background color. \\2 - Pad using the pixels in the edge
         *  row or column \\3 - Do not pad at all. \\4 - Pad using black
         *  pixels. */
        values[values.BACKGROUND_PAD_TYPE = 54] = "BACKGROUND_PAD_TYPE";

        /** Define the maximum amount of padding for Construction to use
         *  when extending the image as a multiple of the head's width. 
         *  I.E. A maximum of 2.0 will pad up to two times the subject's
         *  head width in pixels. */
        values[values.CONDITIONAL_PADDING = 55] = "CONDITIONAL_PADDING";

        /** Define the JPEG Quality Level used for JPEG compression during
         *  Construction. This is only applicable when using the JPEG Image
         *  Format. */
        values[values.JPEG_QUALITY_LEVEL = 56] = "JPEG_QUALITY_LEVEL";

        /** Define the minimum and maximum limits of the file size for a
         *  JPEG 2000 image created during Construction. This is only
         *  applicable when using the JPEG 2000 Image Format. */
        values[values.FILE_SIZE = 57] = "FILE_SIZE";

        /** Define the compression ratio for a JPEG 2000 image created
         *  during Construction.  This is only applicable when using the
         *  JPEG 2000 Image Format. */
        values[values.J2K_COMPRESSION_RATIO = 58] = "J2K_COMPRESSION_RATIO";

        /** Define the compression ratio within the facial region when using
         *  ROI based JPEG 2000 compression in Construction. This is only
         *  applicable when using the JPEG 200 ROI Image Format */
        values[values.J2K_ROI_FOREGROUND_COMPRESSION_RATIO = 59] = "J2K_ROI_FOREGROUND_COMPRESSION_RATIO";

        /** Define the compression ratio for the background region (outside
         *  of the ROI) when using ROI based JPEG 2000 compression in
         *  Construction. This is only applicable when using the JPEG 2000
         *  ROI Image Format. */
        values[values.J2K_ROI_BACKGROUND_COMPRESSION_RATIO = 60] = "J2K_ROI_BACKGROUND_COMPRESSION_RATIO";

        /** Define the acceptable format(s) for the image. The preferred
         *  value in a Profile defines the format of the image created
         *  during Construction. Supported Values are:\\1 - tif \\2 - bmp
         *  \\3 - pnm \\4 - jpeg \\5 - jpeg 2000 \\6 - jpeg 2000 ROI \\11 -
         *  24 bit Raw \\12 - PPM \\13 - PGM \\14 - PNG */
        values[values.IMAGE_FORMAT = 61] = "IMAGE_FORMAT";

        /** The likelihood that the subject is wearing a medical mask or
         *  other lower facial covering.  The current algorithm may struggle
         *  with skin-tone or very dark colored masks. A score of 0
         *  indicates that the subject was not detected wearing a mask. A
         *  score of 100 indicates the subject was detected wearing a mask. */
        values[values.MASK_LIKELIHOOD = 62] = "MASK_LIKELIHOOD";

        return values;
    })(),

    /** Image format
     *  @enum {number} */
    ImageFormat : 
    (function()
    {
        var values = {};
        /** RAW format */
        values[values.RAW = 1] = "RAW";

        /** BMP format */
        values[values.BMP = 2] = "BMP";

        /** JPEG format */
        values[values.JPG = 5] = "JPG";

        /** PNG format */
        values[values.PNG = 7] = "PNG";

        return values;
    })(),

    /** Pose type
     *  @enum {number} */
    PoseType : 
    (function()
    {
        var values = {};
        /** Unknown or unset pose */
        values[values.UNKNOWN = 0] = "UNKNOWN";

        /** Frontal */
        values[values.FRONTAL = 100] = "FRONTAL";

        /** Angled left (45 degrees) */
        values[values.ANGLED_LEFT_45 = 200] = "ANGLED_LEFT_45";

        /** Angled right (45 degrees) */
        values[values.ANGLED_RIGHT_45 = 300] = "ANGLED_RIGHT_45";

        /** Side left (90 degrees) */
        values[values.SIDE_LEFT_90 = 400] = "SIDE_LEFT_90";

        /** Side right (90 degrees) */
        values[values.SIDE_RIGHT_90 = 500] = "SIDE_RIGHT_90";

        return values;
    })(),


    /** List of error codes.
     *  @enum {number} */
    ErrorCode : 
    (function()
    {
        var values = {};
        /** No errors or warnings. */
        values[values.NO_ERRORS = 0] = "NO_ERRORS";

        /** Internal error. */
        values[values.INTERNAL_ERROR = 1] = "INTERNAL_ERROR";

        /** The library failed to allocate memory. */
        values[values.OUT_OF_MEMORY = 100] = "OUT_OF_MEMORY";

        /** The photo_set object was NULL. */
        values[values.NULL_PHOTO_SET_OBJ = 101] = "NULL_PHOTO_SET_OBJ";

        /** No image data is available for the image id. */
        values[values.NO_IMAGE_DATA = 102] = "NO_IMAGE_DATA";

        /** The specified image buffer was not a valid image. */
        values[values.INVALID_IMAGE = 103] = "INVALID_IMAGE";

        /** A profile was not set. */
        values[values.NO_PROFILE = 104] = "NO_PROFILE";

        /** The specified profile was not valid. */
        values[values.INVALID_PROFILE = 105] = "INVALID_PROFILE";

        /** No photo was found in the image. */
        values[values.NO_PHOTO_FOUND = 106] = "NO_PHOTO_FOUND";

        /** Failed to parse image. */
        values[values.PARSING_IMAGE = 107] = "PARSING_IMAGE";

        /** The image format is not supported. */
        values[values.IMAGE_FORMAT_NOT_SUPPORTED = 108] = "IMAGE_FORMAT_NOT_SUPPORTED";

        /** The image could not be loaded. */
        values[values.CANNOT_LOAD_IMAGE = 109] = "CANNOT_LOAD_IMAGE";

        /** A face was not detected in the image. */
        values[values.NO_FACE_DETECTED = 110] = "NO_FACE_DETECTED";

        /** The given image does not meet the minimum image size
         *  requirements. */
        values[values.IMAGE_TOO_SMALL = 116] = "IMAGE_TOO_SMALL";

        /** A query was attempted on an invalid facial feature. */
        values[values.INVALID_FACE_FEATURE = 120] = "INVALID_FACE_FEATURE";

        /** A query was attempted on an invalid metric. */
        values[values.INVALID_METRIC = 121] = "INVALID_METRIC";

        /** The photo capture object did not contain a captured image. */
        values[values.PHOTO_CAPTURE_HAS_NO_CAPTURED_IMAGE = 122] = "PHOTO_CAPTURE_HAS_NO_CAPTURED_IMAGE";

        /** Failed to retrieve the captured image from the photo capture
         *  object. */
        values[values.FAILED_TO_RETRIEVE_CAPTURED_IMAGE = 123] = "FAILED_TO_RETRIEVE_CAPTURED_IMAGE";

        /** The Photo Capture library was not found and is unavailable. */
        values[values.PHOTO_CAPTURE_NOT_AVAILABLE = 124] = "PHOTO_CAPTURE_NOT_AVAILABLE";

        /** Failed to parse the JSON request. */
        values[values.FAILED_TO_PARSE_JSON = 10001] = "FAILED_TO_PARSE_JSON";

        /** The function name was not valid. */
        values[values.INVALID_FUNCTION_NAME = 10002] = "INVALID_FUNCTION_NAME";

        /** The parameter list must be a JSON array. */
        values[values.INVALID_PARAMETER_LIST = 10003] = "INVALID_PARAMETER_LIST";

        /** A parameter had an incorrect type. */
        values[values.INVALID_PARAMETER_TYPE = 10004] = "INVALID_PARAMETER_TYPE";

        /** The wrong number of parameters were passed to the function. */
        values[values.INCORRECT_PARAMETER_COUNT = 10005] = "INCORRECT_PARAMETER_COUNT";

        /** The channel name is incorrect, hasn't been opened, or is closed. */
        values[values.INVALID_CHANNEL_NAME = 10006] = "INVALID_CHANNEL_NAME";

        /** There was an error with the websocket. */
        values[values.WEBSOCKET_ERROR = 10007] = "WEBSOCKET_ERROR";

        return values;
    })(),


};

/** Creates an object that implements the PhotoSet API.
  *
  * @param websocketHandle - Handle to an open websocket connection, connected
  *      to the aw_bio_component_server. The caller is responsible for handling
  *      the "onerror" callback, whereas this class will handle the "onmessage"
  *      callback.
  *
  * @return Object that implements the PhotoSet API.
  */
var createPhotoSet = (function( transportObject, channelName )
{
    var callbacks = {};
    var onReturnDictionary = {};
    var currentMessageId = 0;
    var transport = transportObject;
    var channel = channelName;

    var onMessage = function( result )
    {
        var functionName = result.function;
        var isCallback = false;

        if ( !isCallback )
        {
            var messageId = result.message_id;
            if( !messageId ) return;
            var onReturn = onReturnDictionary[messageId.toString()];
            delete onReturnDictionary[messageId.toString()];
            if ( typeof onReturn == "function" )
            {
                onReturn(
                    result.return_value,
                    result.error.code,
                    result.error.message );
            }
        }
    };

    // Register the channel name with transport so we will receive messages from the server
    transport.register(channel, onMessage);

    var internalStoreOnReturn = function( onReturn )
    {
        if ( currentMessageId >= Number.MAX_SAFE_INTEGER )
        {
            currentMessageId = 0;
        }
        else
        {
            currentMessageId += 1;
        }
        onReturnDictionary[currentMessageId.toString()] = onReturn;
    };


    /** This function destroys the PhotoSet object.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var destroy = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoSetApi.ErrorCode )
                    {
                        if ( PhotoSetApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_set_destroy";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Clears all images, and meta data.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var reset = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoSetApi.ErrorCode )
                    {
                        if ( PhotoSetApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_set_reset";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the profile that will be used to construct images and check for
     *  compliance.
     *  @param {String} profile Profile XML text.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setProfile = function( profile )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoSetApi.ErrorCode )
                    {
                        if ( PhotoSetApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_set_set_profile";
            jsonNode.args = [ profile ];
            transport.send( jsonNode );
        } );
    };

    /** Specify the image to use.
     *  @param {String} imageId Identifier for the image.
     *  @param {String} image Input image.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setImage = function( imageId, image )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoSetApi.ErrorCode )
                    {
                        if ( PhotoSetApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_set_set_image";
            jsonNode.args = [ imageId, image ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the input image using a PhotoCapture object that contains a
     *  captured image.
     *  @param {String} imageId Identifier for the image.
     *  @param {String} photoCapture PhotoCapture object containing a
     *  captured impression image.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setPhotoCaptureImage = function( imageId, photoCapture )
    {
        photoCapture = photoCapture.channel;
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoSetApi.ErrorCode )
                    {
                        if ( PhotoSetApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_set_set_photo_capture_image";
            jsonNode.args = [ imageId, photoCapture ];
            transport.send( jsonNode );
        } );
    };

    /** Set the pose type for an image. Image must already be set. Pose is
     *  cleared when a new image is stored in the same id.
     *  @param {String} imageId Identifier for the image.
     *  @param {Number} pose Pose type for the image.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setPose = function( imageId, pose )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoSetApi.ErrorCode )
                    {
                        if ( PhotoSetApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_set_set_pose";
            jsonNode.args = [ imageId, pose ];
            transport.send( jsonNode );
        } );
    };

    /** Get the pose type for an image. Image must already be set.
     *  @param {String} imageId Identifier for the image.
     *  
     *  @returns {Promise<Number,Error>} Pose type for the image.
     *   */
    var getPose = function( imageId )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoSetApi.ErrorCode )
                    {
                        if ( PhotoSetApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_set_get_pose";
            jsonNode.args = [ imageId ];
            transport.send( jsonNode );
        } );
    };

    /** Constructs an image designed to be compliant with the current
     *  specified profile.
     *  @param {String} imageId Identifier for the image.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var constructImage = function( imageId )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoSetApi.ErrorCode )
                    {
                        if ( PhotoSetApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_set_construct_image";
            jsonNode.args = [ imageId ];
            transport.send( jsonNode );
        } );
    };

    /** Get the specified image.
     *  @param {String} imageId Identifier for the image.
     *  @param {Number} format Desired image format.
     *  
     *  @returns {Promise<String,Error>} Output image.
     *   */
    var getImage = function( imageId, format )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoSetApi.ErrorCode )
                    {
                        if ( PhotoSetApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_set_get_image";
            jsonNode.args = [ imageId, format ];
            transport.send( jsonNode );
        } );
    };

    /** Returns whether the image is compliant with the current profile.
     *  @param {String} imageId Identifier for the image.
     *  
     *  @returns {Promise<Boolean,Error>} Whether the image is compliant.
     *   */
    var isCompliant = function( imageId )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoSetApi.ErrorCode )
                    {
                        if ( PhotoSetApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_set_is_compliant";
            jsonNode.args = [ imageId ];
            transport.send( jsonNode );
        } );
    };

    /** Get the value calculated for an image metric.
     *  @param {String} imageId Identifier for the image.
     *  @param {Number} metric The enumeration of the image metric to check.
     *  
     *  @returns {Promise<Number,Error>} The value of the specified image
     *  metric.  -1.0 means not applicable, -2.0 means not implemented yet.
     *   */
    var getMetricValue = function( imageId, metric )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoSetApi.ErrorCode )
                    {
                        if ( PhotoSetApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_set_get_metric_value";
            jsonNode.args = [ imageId, metric ];
            transport.send( jsonNode );
        } );
    };

    /** Get the state calculated for an image metric.
     *  @param {String} imageId Identifier for the image.
     *  @param {Number} metric image metric to check.
     *  
     *  @returns {Promise<Number,Error>} returns a MetricStatus enumeration
     *  that indicates the compliance state for the metric.
     *   */
    var getMetricStatus = function( imageId, metric )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoSetApi.ErrorCode )
                    {
                        if ( PhotoSetApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_set_get_metric_status";
            jsonNode.args = [ imageId, metric ];
            transport.send( jsonNode );
        } );
    };

    /** Retrieve the floating point x and y coordinates of the specified
     *  feature of the face.
     *  @param {String} imageId Identifier for the image.
     *  @param {Number} feature The feature to locate.
     *  
     *  @returns {Promise<Object,Error>} the feature location.
     *   */
    var getFeatureLocation = function( imageId, feature )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoSetApi.ErrorCode )
                    {
                        if ( PhotoSetApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_set_get_feature_location";
            jsonNode.args = [ imageId, feature ];
            transport.send( jsonNode );
        } );
    };

    /** Sets meta data for an image. Image must already be set. Meta data is
     *  cleared when a new image is entered.
     *  @param {String} imageId Identifier for the image.
     *  @param {String} metadata Metadata for the image.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setMetadata = function( imageId, metadata )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoSetApi.ErrorCode )
                    {
                        if ( PhotoSetApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_set_set_metadata";
            jsonNode.args = [ imageId, metadata ];
            transport.send( jsonNode );
        } );
    };

    /** Retrieves the previously set meta data.
     *  @param {String} imageId Identifier for the image.
     *  
     *  @returns {Promise<String,Error>} Metadata for the impression.
     *   */
    var getMetadata = function( imageId )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoSetApi.ErrorCode )
                    {
                        if ( PhotoSetApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_set_get_metadata";
            jsonNode.args = [ imageId ];
            transport.send( jsonNode );
        } );
    };

    /** Returns integer value indicating the current version of the
     *  component.
     *  
     *  @returns {Promise<Number,Error>} An integer indicating the library
     *  version number.
     *   */
    var getVersion = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoSetApi.ErrorCode )
                    {
                        if ( PhotoSetApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_set_get_version";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Returns a text string indicating the current version of the
     *  component.
     *  
     *  @returns {Promise<String,Error>} A string indicating the library
     *  version number.
     *   */
    var getVersionString = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == PhotoSetApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in PhotoSetApi.ErrorCode )
                    {
                        if ( PhotoSetApi.ErrorCode[errorEntry] == errorCode )
                        {
                            error.errorName = errorEntry;
                            break;
                        }
                    }
                    reject( error );
                }
            } );
            var jsonNode = {};
            jsonNode.message_id = currentMessageId.toString();
            jsonNode.channel = channel;
            jsonNode.function = "aw_photo_set_get_version_string";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };




    var instance = {};
    instance.onMessage = onMessage;
    instance.channel = channel;
    instance.destroy = destroy;
    instance.reset = reset;
    instance.setProfile = setProfile;
    instance.setImage = setImage;
    instance.setPhotoCaptureImage = setPhotoCaptureImage;
    instance.setPose = setPose;
    instance.getPose = getPose;
    instance.constructImage = constructImage;
    instance.getImage = getImage;
    instance.isCompliant = isCompliant;
    instance.getMetricValue = getMetricValue;
    instance.getMetricStatus = getMetricStatus;
    instance.getFeatureLocation = getFeatureLocation;
    instance.setMetadata = setMetadata;
    instance.getMetadata = getMetadata;
    instance.getVersion = getVersion;
    instance.getVersionString = getVersionString;

    return new Promise( function( resolve, reject )
    {
        internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
        {
            if ( errorCode == PhotoSetApi.ErrorCode.NO_ERRORS )
            {
                resolve( instance );
            }
            else
            {
                reject( errorMessage );
            }
        } );
        var jsonNode = {};
        jsonNode.message_id = currentMessageId.toString();
        jsonNode.function = "aw_photo_set_create";
        jsonNode.channel = channel;
        transport.send( jsonNode );
    } );
});

