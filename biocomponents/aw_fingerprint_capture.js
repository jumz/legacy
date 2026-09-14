/* Copyright (C) 2019 Aware, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
 
/** @namespace
  */
var FingerprintCaptureApi =
{
    /** Current state of the device.
     *  @enum {number} */
    DeviceState : 
    (function()
    {
        var values = {};
        /** Device has not been opened. */
        values[values.NOT_OPENED = 0] = "NOT_OPENED";

        /** Device is opened and operational, but not performing any action. */
        values[values.IDLE = 1] = "IDLE";

        /** Device is scanning and collecting data. */
        values[values.SCANNING = 2] = "SCANNING";

        /** Device is capturing the final image. */
        values[values.CAPTURING = 3] = "CAPTURING";

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

        /** WSQ format */
        values[values.WSQ = 3] = "WSQ";

        /** JPEG format */
        values[values.JPG = 5] = "JPG";

        /** PNG format */
        values[values.PNG = 7] = "PNG";

        return values;
    })(),

    /** Autocapture status
     *  @enum {number} */
    AutocaptureStatus : 
    (function()
    {
        var values = {};
        /** Device Initialization Started */
        values[values.SCANNER_INITIALIZATION_STARTED = 10101] = "SCANNER_INITIALIZATION_STARTED";

        /** Warning During Device Initialization */
        values[values.SCANNER_INITIALIZATION_WARNING_OCCURRED = 10102] = "SCANNER_INITIALIZATION_WARNING_OCCURRED";

        /** Device Initialization Failed */
        values[values.SCANNER_INITIALIZATION_FAILED = 10103] = "SCANNER_INITIALIZATION_FAILED";

        /** Device Initialization Complete */
        values[values.SCANNER_INITIALIZATION_COMPLETED = 10104] = "SCANNER_INITIALIZATION_COMPLETED";

        /** Device Close Started */
        values[values.SCANNER_CLOSE_STARTED = 10201] = "SCANNER_CLOSE_STARTED";

        /** Warning During Device Close */
        values[values.SCANNER_CLOSE_WARNING_OCCURRED = 10202] = "SCANNER_CLOSE_WARNING_OCCURRED";

        /** Device Close Failed */
        values[values.SCANNER_CLOSE_FAILED = 10203] = "SCANNER_CLOSE_FAILED";

        /** Device Closed */
        values[values.SCANNER_CLOSE_COMPLETED = 10204] = "SCANNER_CLOSE_COMPLETED";

        /** Calibration Not Supported */
        values[values.SCANNER_CALIBRATION_NOT_SUPPORTED = 10301] = "SCANNER_CALIBRATION_NOT_SUPPORTED";

        /** Calibrating Device */
        values[values.SCANNER_CALIBRATION_STARTED = 10302] = "SCANNER_CALIBRATION_STARTED";

        /** Error Calibrating Device */
        values[values.SCANNER_CALIBRATION_FAILED = 10303] = "SCANNER_CALIBRATION_FAILED";

        /** Calibration Complete */
        values[values.SCANNER_CALIBRATION_COMPLETED = 10304] = "SCANNER_CALIBRATION_COMPLETED";

        /** Device Calibration Message */
        values[values.SCANNER_CALIBRATION_MESSAGE = 10310] = "SCANNER_CALIBRATION_MESSAGE";

        /** Resetting Device */
        values[values.SCANNER_RESET_STARTED = 10401] = "SCANNER_RESET_STARTED";

        /** Warning During Device Reset */
        values[values.SCANNER_RESET_WARNING_OCCURRED = 10402] = "SCANNER_RESET_WARNING_OCCURRED";

        /** Device Reset Failed */
        values[values.SCANNER_RESET_FAILED = 10403] = "SCANNER_RESET_FAILED";

        /** Device Successfully Reset */
        values[values.SCANNER_RESET_COMPLETED = 10404] = "SCANNER_RESET_COMPLETED";

        /** Scanner Is Dirty Or Fingers On Scanner  */
        values[values.SCANNER_DIRTY = 10504] = "SCANNER_DIRTY";

        /** Scanner is disconnected or not responding */
        values[values.SCANNER_DISCONNECTED = 10505] = "SCANNER_DISCONNECTED";

        /** Preview Started */
        values[values.CAPTURE_PREVIEW_STARTED = 20101] = "CAPTURE_PREVIEW_STARTED";

        /** Capture Aborted */
        values[values.CAPTURE_ABORTED = 20102] = "CAPTURE_ABORTED";

        /** Capture Complete */
        values[values.CAPTURE_COMPLETED = 20103] = "CAPTURE_COMPLETED";

        /** Use of handedness detection is not recommended when fingers are
         *  missing */
        values[values.SOFTWAREAUTOCAPTURECONFIG_HANDEDNESS_NOT_RECOMMENDED = 30001] = "SOFTWAREAUTOCAPTURECONFIG_HANDEDNESS_NOT_RECOMMENDED";

        /** Auto-capture Session Started */
        values[values.SOFTWAREAUTOCAPTURE_STARTED = 30101] = "Inicializado";

        /** Auto-capture Initiated */
        values[values.SOFTWAREAUTOCAPTURE_CAPTURE_INITIATED = 30102] = "La captura está inicializada";

        /** Too Few Fingers */
        values[values.SOFTWAREAUTOCAPTURE_TOO_FEW_FINGERS = 30201] = "Pocos dedos";

        /** Too Many Fingers */
        values[values.SOFTWAREAUTOCAPTURE_TOO_MANY_FINGERS = 30202] = "Demasiados dedos";

        /** No Fingers */
        values[values.SOFTWAREAUTOCAPTURE_NO_FINGERS = 30203] = "No hay dedos";

        /** Incorrect Hand */
        values[values.SOFTWAREAUTOCAPTURE_INCORRECT_HAND = 30301] = "Mano incorrecta";

        /** Insufficient Finger Quality */
        values[values.SOFTWAREAUTOCAPTURE_INSUFFICIENT_FINGER_QUALITY = 30401] = "Calidad insuficiente";

        /** Finger Angle is Too Large */
        values[values.SOFTWAREAUTOCAPTURE_FINGER_ANGLE_TOO_LARGE = 30402] = "Ángulo muy largo";

        /** Finger Touching Image Edge */
        values[values.SOFTWAREAUTOCAPTURE_FINGER_TOUCHING_EDGE = 30501] = "Dedos tocando el borde";

        /** Finger Too Tall */
        values[values.SOFTWAREAUTOCAPTURE_FINGER_TOO_TALL = 30601] = "Dedo muy largo";

        /** Finger Too Short */
        values[values.SOFTWAREAUTOCAPTURE_FINGER_TOO_SHORT = 30602] = "Dedo muy corto";

        /** Finger Too Wide */
        values[values.SOFTWAREAUTOCAPTURE_FINGER_TOO_WIDE = 30603] = "Dedo muy amplio";

        /** Finger Too Narrow */
        values[values.SOFTWAREAUTOCAPTURE_FINGER_TOO_NARROW = 30604] = "Dedo muy estrecho";

        /** Finger Movement Detected */
        values[values.SOFTWAREAUTOCAPTURE_FINGER_MOVEMENT_DETECTED = 30701] = "Detectado moviento de dedo";

        /** Passing Frames Collected */
        values[values.SOFTWAREAUTOCAPTURE_PASSING_FRAME_COLLECTED = 30801] = "Enviando información";

        /** Timeout Exceeded, Capturing */
        values[values.SOFTWAREAUTOCAPTURE_TIMEOUT_EXCEEDED_CAPTURING = 30901] = "Tiempo excedido para capturar";

        /** Timeout Exceeded, Aborting */
        values[values.SOFTWAREAUTOCAPTURE_TIMEOUT_EXCEEDED_ABORTED = 30902] = "Tiempo excedido para capturar abortado";

        return values;
    })(),

    /** How rolls should be captured.
     *  @enum {number} */
    RollCaptureMode : 
    (function()
    {
        var values = {};
        /** Edge to Edge. */
        values[values.EDGE_TO_EDGE = 0] = "EDGE_TO_EDGE";

        /** Center and roll. */
        values[values.CENTER_AND_ROLL = 1] = "CENTER_AND_ROLL";

        return values;
    })(),

    /** How flats should be captured.
     *  @enum {number} */
    FlatCaptureMode : 
    (function()
    {
        var values = {};
        /** Fingers are angled to fit within a 2 inch platen. */
        values[values.TWO_INCH_FLATS = 0] = "TWO_INCH_FLATS";

        /** Finger are straight to fit within a 3 inch platen. */
        values[values.THREE_INCH_FLATS = 1] = "THREE_INCH_FLATS";

        return values;
    })(),

    /** Finger.
     *  @enum {number} */
    Finger : 
    (function()
    {
        var values = {};
        /** right thumb. */
        values[values.RIGHT_THUMB = 1] = "RIGHT_THUMB";

        /** right index finger. */
        values[values.RIGHT_INDEX_FINGER = 2] = "RIGHT_INDEX_FINGER";

        /** right middle finger. */
        values[values.RIGHT_MIDDLE_FINGER = 3] = "RIGHT_MIDDLE_FINGER";

        /** right ring finger. */
        values[values.RIGHT_RING_FINGER = 4] = "RIGHT_RING_FINGER";

        /** right little finger. */
        values[values.RIGHT_LITTLE_FINGER = 5] = "RIGHT_LITTLE_FINGER";

        /** left thumb. */
        values[values.LEFT_THUMB = 6] = "LEFT_THUMB";

        /** left index finger. */
        values[values.LEFT_INDEX_FINGER = 7] = "LEFT_INDEX_FINGER";

        /** left middle finger. */
        values[values.LEFT_MIDDLE_FINGER = 8] = "LEFT_MIDDLE_FINGER";

        /** left ring finger. */
        values[values.LEFT_RING_FINGER = 9] = "LEFT_RING_FINGER";

        /** left little finger. */
        values[values.LEFT_LITTLE_FINGER = 10] = "LEFT_LITTLE_FINGER";

        return values;
    })(),

    /** Impression.
     *  @enum {number} */
    Impression : 
    (function()
    {
        var values = {};
        /** Rolled right thumb. */
        values[values.ROLLED_RIGHT_THUMB = 1] = "Pulgar derecho rolado";

        /** Rolled right index finger. */
        values[values.ROLLED_RIGHT_INDEX_FINGER = 2] = "Índice derecho rolado";

        /** Rolled right middle finger. */
        values[values.ROLLED_RIGHT_MIDDLE_FINGER = 3] = "Medio derecho rolado";

        /** Rolled right ring finger. */
        values[values.ROLLED_RIGHT_RING_FINGER = 4] = "Anular derecho rolado";

        /** Rolled right little finger. */
        values[values.ROLLED_RIGHT_LITTLE_FINGER = 5] = "Meñique derecho rolado";

        /** Rolled left thumb. */
        values[values.ROLLED_LEFT_THUMB = 6] = "Pulgar izquierdo rolado";

        /** Rolled left index finger. */
        values[values.ROLLED_LEFT_INDEX_FINGER = 7] = "Índice izquierdo rolado";

        /** Rolled left middle finger. */
        values[values.ROLLED_LEFT_MIDDLE_FINGER = 8] = "Medio izquierdo rolado";

        /** Rolled left ring finger. */
        values[values.ROLLED_LEFT_RING_FINGER = 9] = "Anular izquierdo rolado";

        /** Rolled left little finger. */
        values[values.ROLLED_LEFT_LITTLE_FINGER = 10] = "Meñique izquierdo rolado";

        /** Plain right thumb. */
        values[values.PLAIN_RIGHT_THUMB = 11] = "Pulgar derecho";

        /** Plain left thumb. */
        values[values.PLAIN_LEFT_THUMB = 12] = "Pulgar izquierdo";

        /** Four fingered slap of the right hand. */
        values[values.PLAIN_RIGHT_FOUR_FINGERS = 13] = "Mano derecha";

        /** Four fingered slap of the left hand. */
        values[values.PLAIN_LEFT_FOUR_FINGERS = 14] = "Mano izquierda";

        /** Plain right index finger found within a plain right four finger
         *  slap */
        values[values.RIGHT_SLAP_INDEX_FINGER = 15] = "RIGHT_SLAP_INDEX_FINGER";

        /** Plain right middle finger found within a plain right four finger
         *  slap. */
        values[values.RIGHT_SLAP_MIDDLE_FINGER = 16] = "RIGHT_SLAP_MIDDLE_FINGER";

        /** Plain right ring finger found within a plain right four finger
         *  slap. */
        values[values.RIGHT_SLAP_RING_FINGER = 17] = "RIGHT_SLAP_RING_FINGER";

        /** Plain right little finger found within a plain right four finger
         *  slap. */
        values[values.RIGHT_SLAP_LITTLE_FINGER = 18] = "RIGHT_SLAP_LITTLE_FINGER";

        /** Plain left index finger found within a plain left four finger
         *  slap. */
        values[values.LEFT_SLAP_INDEX_FINGER = 19] = "LEFT_SLAP_INDEX_FINGER";

        /** Plain left middle finger found within a plain left four finger
         *  slap. */
        values[values.LEFT_SLAP_MIDDLE_FINGER = 20] = "LEFT_SLAP_MIDDLE_FINGER";

        /** Plain left ring finger found within a plain left four finger
         *  slap. */
        values[values.LEFT_SLAP_RING_FINGER = 21] = "LEFT_SLAP_RING_FINGER";

        /** Plain left little finger found within a plain left four finger
         *  slap. */
        values[values.LEFT_SLAP_LITTLE_FINGER = 22] = "LEFT_SLAP_LITTLE_FINGER";

        /** Plain dual (right and left) thumbs */
        values[values.PLAIN_DUAL_THUMBS = 31] = "Ambos pulgares";

        /** Plain right thumb from within a dual thumb impression */
        values[values.PLAIN_DUAL_THUMBS_RIGHT = 32] = "PLAIN_DUAL_THUMBS_RIGHT";

        /** Plain left thumb from within a dual thumb impression. */
        values[values.PLAIN_DUAL_THUMBS_LEFT = 33] = "PLAIN_DUAL_THUMBS_LEFT";

        /** Plain right index finger. */
        values[values.PLAIN_RIGHT_INDEX_FINGER = 80] = "Índice derecho";

        /** Plain right middle finger. */
        values[values.PLAIN_RIGHT_MIDDLE_FINGER = 81] = "Medio derecho";

        /** Plain right ring finger. */
        values[values.PLAIN_RIGHT_RING_FINGER = 82] = "Anular derecho";

        /** Plain right little finger. */
        values[values.PLAIN_RIGHT_LITTLE_FINGER = 83] = "Meñique derecho";

        /** Plain left index finger. */
        values[values.PLAIN_LEFT_INDEX_FINGER = 84] = "Índice izquierdo";

        /** Plain left middle finger. */
        values[values.PLAIN_LEFT_MIDDLE_FINGER = 85] = "Medio izquierdo";

        /** Plain left ring finger. */
        values[values.PLAIN_LEFT_RING_FINGER = 86] = "Anular izquierdo";

        /** Plain left little finger. */
        values[values.PLAIN_LEFT_LITTLE_FINGER = 87] = "Meñique izquierdo";

        /** First two finger right. */
        values[values.FIRST_TWO_FINGER_RIGHT = 62] = "FIRST_TWO_FINGER_RIGHT";

        /** First two finger left. */
        values[values.FIRST_TWO_FINGER_LEFT = 65] = "FIRST_TWO_FINGER_LEFT";

        /** Second two finger right. */
        values[values.SECOND_TWO_FINGER_RIGHT = 68] = "SECOND_TWO_FINGER_RIGHT";

        /** Second two finger left. */
        values[values.SECOND_TWO_FINGER_LEFT = 71] = "SECOND_TWO_FINGER_LEFT";

        /** Third two finger right. */
        values[values.THIRD_TWO_FINGER_RIGHT = 74] = "THIRD_TWO_FINGER_RIGHT";

        /** Third two finger left. */
        values[values.THIRD_TWO_FINGER_LEFT = 77] = "THIRD_TWO_FINGER_LEFT";

        /** Dual index. */
        values[values.DUAL_INDEX = 114] = "DUAL_INDEX";

        /** First two finger right index finger. */
        values[values.FIRST_TWO_FINGER_RIGHT_INDEX_FINGER = 63] = "FIRST_TWO_FINGER_RIGHT_INDEX_FINGER";

        /** First two finger right middle finger. */
        values[values.FIRST_TWO_FINGER_RIGHT_MIDDLE_FINGER = 64] = "FIRST_TWO_FINGER_RIGHT_MIDDLE_FINGER";

        /** First two finger left index finger. */
        values[values.FIRST_TWO_FINGER_LEFT_INDEX_FINGER = 66] = "FIRST_TWO_FINGER_LEFT_INDEX_FINGER";

        /** First two finger left middle finger. */
        values[values.FIRST_TWO_FINGER_LEFT_MIDDLE_FINGER = 67] = "FIRST_TWO_FINGER_LEFT_MIDDLE_FINGER";

        /** Second two finger right middle finger. */
        values[values.SECOND_TWO_FINGER_RIGHT_MIDDLE_FINGER = 69] = "SECOND_TWO_FINGER_RIGHT_MIDDLE_FINGER";

        /** Second two finger right ring finger. */
        values[values.SECOND_TWO_FINGER_RIGHT_RING_FINGER = 70] = "SECOND_TWO_FINGER_RIGHT_RING_FINGER";

        /** Second two finger left middle finger. */
        values[values.SECOND_TWO_FINGER_LEFT_MIDDLE_FINGER = 72] = "SECOND_TWO_FINGER_LEFT_MIDDLE_FINGER";

        /** Second two finger left ring finger. */
        values[values.SECOND_TWO_FINGER_LEFT_RING_FINGER = 73] = "SECOND_TWO_FINGER_LEFT_RING_FINGER";

        /** Third two finger right ring finger. */
        values[values.THIRD_TWO_FINGER_RIGHT_RING_FINGER = 75] = "THIRD_TWO_FINGER_RIGHT_RING_FINGER";

        /** Third two finger right little finger. */
        values[values.THIRD_TWO_FINGER_RIGHT_LITTLE_FINGER = 76] = "THIRD_TWO_FINGER_RIGHT_LITTLE_FINGER";

        /** Third two finger left ring finger. */
        values[values.THIRD_TWO_FINGER_LEFT_RING_FINGER = 78] = "THIRD_TWO_FINGER_LEFT_RING_FINGER";

        /** Third two finger left little finger. */
        values[values.THIRD_TWO_FINGER_LEFT_LITTLE_FINGER = 79] = "THIRD_TWO_FINGER_LEFT_LITTLE_FINGER";

        /** Dual index right index. */
        values[values.DUAL_INDEX_RIGHT_INDEX = 116] = "DUAL_INDEX_RIGHT_INDEX";

        /** Dual index left index. */
        values[values.DUAL_INDEX_LEFT_INDEX = 115] = "DUAL_INDEX_LEFT_INDEX";

        return values;
    })(),

    /** Properties used to control advanced features of devices.
     *  @enum {number} */
    DeviceProperty : 
    (function()
    {
        var values = {};
        /** X position to display a preview window for certain devices. */
        values[values.PREVIEW_WINDOW_POS_X = 1] = "PREVIEW_WINDOW_POS_X";

        /** Y position to display a preview window for certain devices. */
        values[values.PREVIEW_WINDOW_POS_Y = 2] = "PREVIEW_WINDOW_POS_Y";

        /** Width of the preview window to display. */
        values[values.PREVIEW_WINDOW_WIDTH = 3] = "PREVIEW_WINDOW_WIDTH";

        /** Height of the preview window to display. */
        values[values.PREVIEW_WINDOW_HEIGHT = 4] = "PREVIEW_WINDOW_HEIGHT";

        /** Enable liveness detection. */
        values[values.LIVENESS_DETECTION_ENABLE = 5] = "LIVENESS_DETECTION_ENABLE";

        /** Roll capture mode. */
        values[values.ROLL_CAPTURE_MODE = 6] = "ROLL_CAPTURE_MODE";

        /** id_flat_supported, read only property, 1=supported 0=not
         *  supported -1=unknown. */
        values[values.ID_FLAT_SUPPORTED = 7] = "ID_FLAT_SUPPORTED";

        /** type4_flat_supported, read only property, 1=supported 0=not
         *  supported -1=unknown. */
        values[values.TYPE4_FLAT_SUPPORTED = 8] = "TYPE4_FLAT_SUPPORTED";

        /** 1=id flat mode. 0=type4 flat mode. */
        values[values.FLAT_CAPTURE_MODE = 9] = "FLAT_CAPTURE_MODE";

        /** flat_liveness_detection_supported, read only property,
         *  1=supported 0=not supported -1=unknown. */
        values[values.FLAT_LIVENESS_DETECTION_SUPPORTED = 10] = "FLAT_LIVENESS_DETECTION_SUPPORTED";

        /** rolled_liveness_detection_supported, read only property,
         *  1=supported 0=not supported -1=unknown. */
        values[values.ROLLED_LIVENESS_DETECTION_SUPPORTED = 11] = "ROLLED_LIVENESS_DETECTION_SUPPORTED";

        /** The liveness_cutoff property is a confidence level for liveness
         *  determination. It is used by the aw_ls_device_get_value() method
         *  with the AW_LS_DEVICE_VALUE_IS_SUBJECT_ALIVE enum, when
         *  determing whether a finger is live. A high value of
         *  liveness_cutoff will cause most spoof fingers to be detected but
         *  may also result in more valid (live) fingers being flagged as
         *  spoofs. A low value of liveness_cutoff will cause some spoof
         *  fingers to not be detected but should reduce the number of valid
         *  (live) fingers being incorrectly flagged as spoofs. Users may
         *  want to do their own testing when determining the best values to
         *  use for the liveness_cutoff.  The default value for this
         *  property is 0, liveness_cutoff, write only property, range is
         *  (0-100). */
        values[values.LIVENESS_CUTOFF = 12] = "LIVENESS_CUTOFF";

        /** Whether the scanner supports calibration or not, read only
         *  property, 1=supported 0=not supported -1=unknown. */
        values[values.CALIBRATE_SUPPORTED = 13] = "CALIBRATE_SUPPORTED";

        /** Scanner standby mode, write only property, 1=set the device in
         *  standby mode on a close or reset command 0=do not set the device
         *  in standby mode on a close or reset command -1=unknown,
         *  default=1.  Currently only useful with CrossMatch devices. */
        values[values.STANDBY_MODE = 14] = "STANDBY_MODE";

        /** beep_supported, read only property, 1=supported 0=not supported. */
        values[values.BEEP_SUPPORTED = 15] = "BEEP_SUPPORTED";

        /** beeps_enable, 1=enabled, 0=disabled, default=disabled. */
        values[values.BEEPS_ENABLE = 16] = "BEEPS_ENABLE";

        /** has_graphic_display, read only property, 1=true 0=false. */
        values[values.HAS_GRAPHIC_DISPLAY = 17] = "HAS_GRAPHIC_DISPLAY";

        /** roll_status_supported, read only property, 1=true 0=false. */
        values[values.ROLL_STATUS_SUPPORTED = 18] = "ROLL_STATUS_SUPPORTED";

        /** roll_status_enable, 1=true 0=false. */
        values[values.ROLL_STATUS_ENABLE = 19] = "ROLL_STATUS_ENABLE";

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

        /** Failed to connect to the server. */
        values[values.FAILED_TO_CONNECT_TO_SERVER = 4] = "FAILED_TO_CONNECT_TO_SERVER";

        /** The library failed to allocate memory. */
        values[values.OUT_OF_MEMORY = 100] = "OUT_OF_MEMORY";

        /** The fingerprint_capture object was NULL. */
        values[values.NULL_FINGERPRINT_CAPTURE_OBJ = 101] = "NULL_FINGERPRINT_CAPTURE_OBJ";

        /** Invalid image format. */
        values[values.INVALID_IMAGE_FORMAT = 102] = "INVALID_IMAGE_FORMAT";

        /** Invalid conversion failed. */
        values[values.IMAGE_CONVERSION_FAILED = 103] = "IMAGE_CONVERSION_FAILED";

        /** Could not open the file. */
        values[values.COULD_NOT_OPEN_FILE = 104] = "COULD_NOT_OPEN_FILE";

        /** A device error occurred. */
        values[values.DEVICE_ERROR = 105] = "DEVICE_ERROR";

        /** The DLL required to run the device is not present. */
        values[values.DEVICE_DLL_NOT_PRESENT = 106] = "DEVICE_DLL_NOT_PRESENT";

        /** The device functionality has not been implemented. */
        values[values.DEVICE_FUNCTIONALITY_NOT_IMPLEMENTED = 107] = "DEVICE_FUNCTIONALITY_NOT_IMPLEMENTED";

        /** Failed to parse the configuration file. */
        values[values.FAILED_TO_PARSE_CONFIG_FILE = 108] = "FAILED_TO_PARSE_CONFIG_FILE";

        /** The configuration file has not been loaded. */
        values[values.CONFIG_FILE_NOT_LOADED = 109] = "CONFIG_FILE_NOT_LOADED";

        /** The configuration file contained an invalid value. */
        values[values.INVALID_CONFIG_VALUE = 110] = "INVALID_CONFIG_VALUE";

        /** The device has not been initialized. */
        values[values.DEVICE_NOT_INITIALIZED = 111] = "DEVICE_NOT_INITIALIZED";

        /** Invalid resolution. */
        values[values.INVALID_RESOLUTION = 112] = "INVALID_RESOLUTION";

        /** The device is not connected to the computer. */
        values[values.DEVICE_NOT_CONNECTED = 113] = "DEVICE_NOT_CONNECTED";

        /** The device is not supported. */
        values[values.DEVICE_NOT_SUPPORTED = 114] = "DEVICE_NOT_SUPPORTED";

        /** The device must be plugged in at startup. */
        values[values.DEVICE_NOT_PRESENT_AT_STARTUP = 115] = "DEVICE_NOT_PRESENT_AT_STARTUP";

        /** The device must be calibrated before proceeding. */
        values[values.DEVICE_NOT_CALIBRATED = 116] = "DEVICE_NOT_CALIBRATED";

        /** The device must be turned off, unplugged from the computer and
         *  reconnected. */
        values[values.DEVICE_MUST_BE_RECONNECTED = 117] = "DEVICE_MUST_BE_RECONNECTED";

        /** The device does not support this functionality. */
        values[values.DEVICE_CAPABILITY_NOT_SUPPORTED = 118] = "DEVICE_CAPABILITY_NOT_SUPPORTED";

        /** This impression type is not supported by         this device
         *  model. */
        values[values.IMPRESSION_TYPE_NOT_SUPPORTED = 119] = "IMPRESSION_TYPE_NOT_SUPPORTED";

        /** This impression is not supported by this device model. */
        values[values.IMPRESSION_NOT_SUPPORTED = 120] = "IMPRESSION_NOT_SUPPORTED";

        /** This resolution is not supported by this device model. */
        values[values.DEVICE_RESOLUTION_NOT_SUPPORTED = 121] = "DEVICE_RESOLUTION_NOT_SUPPORTED";

        /** This LED setting is not supported by this device model. */
        values[values.DEVICE_LED_SETTING_NOT_SUPPORTED = 122] = "DEVICE_LED_SETTING_NOT_SUPPORTED";

        /** Liveness detection is not enabled. */
        values[values.DEVICE_LIVENESS_DETECTION_NOT_ENABLED = 123] = "DEVICE_LIVENESS_DETECTION_NOT_ENABLED";

        /** The scanner is busy and cannot complete the operation. */
        values[values.DEVICE_BUSY = 124] = "DEVICE_BUSY";

        /** The device is not licensed for hardware autocapture. */
        values[values.NO_HW_AUTOCAPTURE_LICENSE_FOUND = 125] = "NO_HW_AUTOCAPTURE_LICENSE_FOUND";

        /** The function doesn't support the specified finger position. */
        values[values.INVALID_FINGER_POSITION = 126] = "INVALID_FINGER_POSITION";

        /** The scan cannot be started with a finger on the platen or platen
         *  is dirty. */
        values[values.CANNOT_START_WITH_FINGER_ON_PLATEN = 127] = "CANNOT_START_WITH_FINGER_ON_PLATEN";

        /** There is no captured image available. */
        values[values.NO_CAPTURED_IMAGE = 200] = "NO_CAPTURED_IMAGE";

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

/** Creates an object that implements the FingerprintCapture API.
  *
  * @param websocketHandle - Handle to an open websocket connection, connected
  *      to the aw_bio_component_server. The caller is responsible for handling
  *      the "onerror" callback, whereas this class will handle the "onmessage"
  *      callback.
  *
  * @return Object that implements the FingerprintCapture API.
  */
var createFingerprintCapture = (function( transportObject, channelName )
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
        if ( !isCallback &&  functionName == "aw_fingerprint_capture_device_state_updated" )
        {
            if ( typeof callbacks.deviceStateUpdated != "undefined" )
            {
                callbacks.deviceStateUpdated.apply( null, result.args );
            }
            isCallback = true;
        }
        if ( !isCallback &&  functionName == "aw_fingerprint_capture_preview_image_updated" )
        {
            if ( typeof callbacks.previewImageUpdated != "undefined" )
            {
                callbacks.previewImageUpdated.apply( null, result.args );
            }
            isCallback = true;
        }
        if ( !isCallback &&  functionName == "aw_fingerprint_capture_preview_quality_score_updated" )
        {
            if ( typeof callbacks.previewQualityScoreUpdated != "undefined" )
            {
                callbacks.previewQualityScoreUpdated.apply( null, result.args );
            }
            isCallback = true;
        }
        if ( !isCallback &&  functionName == "aw_fingerprint_capture_autocapture_status_updated" )
        {
            if ( typeof callbacks.autocaptureStatusUpdated != "undefined" )
            {
                callbacks.autocaptureStatusUpdated.apply( null, result.args );
            }
            isCallback = true;
        }
        if ( !isCallback &&  functionName == "aw_fingerprint_capture_captured_image_updated" )
        {
            if ( typeof callbacks.capturedImageUpdated != "undefined" )
            {
                callbacks.capturedImageUpdated.apply( null, result.args );
            }
            isCallback = true;
        }
        if ( !isCallback &&  functionName == "aw_fingerprint_capture_current_impression_updated" )
        {
            if ( typeof callbacks.currentImpressionUpdated != "undefined" )
            {
                callbacks.currentImpressionUpdated.apply( null, result.args );
            }
            isCallback = true;
        }

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


    /** This function destroys the FingerprintCapture object.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var destroy = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_destroy";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Opens a session with one of the specified devices.
     *  @param {String} deviceList Comma separated list that specifies one
     *  or more fingerprint scanners. Each scanner will be attempted until
     *  one succeeds or all fail.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var openDevice = function( deviceList )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_open_device";
            jsonNode.args = [ deviceList ];
            transport.send( jsonNode );
        } );
    };

    /** Closes the session with the current device.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var close = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_close";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Performs a device calibration.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var calibrate = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_calibrate";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Indicates whether the device needs to be calibrated. For devices
     *  that do not support calibration, true is always returned.
     *  
     *  @returns {Promise<Boolean,Error>} True if the device does not need
     *  to have calibration run.
     *   */
    var deviceIsCalibrated = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_device_is_calibrated";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the configuration file that is used to control the auto capture
     *  parameters.
     *  @param {String} autoCaptureConfiguration Auto capture configuration
     *  XML.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setAutoCaptureConfiguration = function( autoCaptureConfiguration )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_set_auto_capture_configuration";
            jsonNode.args = [ autoCaptureConfiguration ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the capture resolution for the livescan device. Must be set
     *  after opening a livescan device.
     *  @param {Number} resolution Capture resolution.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setCaptureResolution = function( resolution )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_set_capture_resolution";
            jsonNode.args = [ resolution ];
            transport.send( jsonNode );
        } );
    };

    /** Gets the current capture resolution for the livescan device.
     *  
     *  @returns {Promise<Number,Error>} Capture resolution.
     *   */
    var getCaptureResolution = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_get_capture_resolution";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Starts collection of a fingerprint impression.
     *  preview_image_updated, preview_quality_score_updated, and
     *  autocapture_status_updated callbacks will be called as new data is
     *  collected. Once the previewed image is of sufficient quality, it
     *  will be captured and the captured_image_updated callback will be
     *  called.
     *  @param {Number} impression Impression to capture.
     *  @param {Number} imageFormat Desired image format for the preview.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var startAutoCapture = function( impression, imageFormat )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_start_auto_capture";
            jsonNode.args = [ impression, imageFormat ];
            transport.send( jsonNode );
        } );
    };

    /** Disables autocapture.
     *  @param {Boolean} disable If true, autocapture is disabled.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var disableAutoCapture = function( disable )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_disable_auto_capture";
            jsonNode.args = [ disable ];
            transport.send( jsonNode );
        } );
    };

    /** Ends the current auto capture collection.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var endAutoCapture = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_end_auto_capture";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Tells the scanner to initiate a final image capture, regardless of
     *  current auto capture status.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var captureImage = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_capture_image";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Plays an audio cue that indicates capture was successful.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var playOnCaptureAudio = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_play_on_capture_audio";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Plays an audio cue that indicates a failure.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var playOnFailureAudio = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_play_on_failure_audio";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the finger as present or missing.
     *  @param {Number} finger Finger to change.
     *  @param {Boolean} missing Whether the finger is missing.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var setFingerMissing = function( finger, missing )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_set_finger_missing";
            jsonNode.args = [ finger, missing ];
            transport.send( jsonNode );
        } );
    };

    /** Sets all fingers as present.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var resetMissingFingers = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_reset_missing_fingers";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** This function queries for a given property, and if that property
     *  exists, returns its value
     *              for a given livescan device.
     *  @param {Number} property Which property to get.
     *  
     *  @returns {Promise<Number,Error>} The value of the property.
     *   */
    var deviceGetProperty = function( property )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_device_get_property";
            jsonNode.args = [ property ];
            transport.send( jsonNode );
        } );
    };

    /** This function sets a given property for a given livescan device.
     *  @param {Number} property Which property to get.
     *  @param {Number} value The value of the property.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var deviceSetProperty = function( property, value )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_device_set_property";
            jsonNode.args = [ property, value ];
            transport.send( jsonNode );
        } );
    };

    /** Turns on audio feedback on for devices that support audio.
     *  @param {Boolean} enableAudio If true, beep at the start and end of
     *  capture.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var deviceEnableAudio = function( enableAudio )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_device_enable_audio";
            jsonNode.args = [ enableAudio ];
            transport.send( jsonNode );
        } );
    };

    /** Retrieves the captured image in the specified image format.
     *  @param {Number} imageFormat Image format.
     *  
     *  @returns {Promise<String,Error>} Captured image.
     *   */
    var getCapturedImage = function( imageFormat )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_get_captured_image";
            jsonNode.args = [ imageFormat ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the device_state_updated.
     *  @param {String} deviceStateUpdated Callback to notify when the
     *  device state has changed.
     *   */
    var setDeviceStateUpdated = function( deviceStateUpdated )
    {
        callbacks.deviceStateUpdated = deviceStateUpdated;
    };

    /** Sets the preview_image_updated.
     *  @param {String} previewImageUpdated Callback with the updated
     *  preview image.
     *   */
    var setPreviewImageUpdated = function( previewImageUpdated )
    {
        callbacks.previewImageUpdated = previewImageUpdated;
    };

    /** Requests that the next preview image be sent through the callback,
     *  when it is available.
     *  
     *  @returns {Promise<,Error>}
     *   */
    var requestNextPreviewImage = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve();
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_request_next_preview_image";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** Sets the preview_quality_score_updated.
     *  @param {String} previewQualityScoreUpdated Callback with the updated
     *  preview quality score.
     *   */
    var setPreviewQualityScoreUpdated = function( previewQualityScoreUpdated )
    {
        callbacks.previewQualityScoreUpdated = previewQualityScoreUpdated;
    };

    /** Sets the autocapture_status_updated.
     *  @param {String} autocaptureStatusUpdated Callback with the updated
     *  autocapture status score.
     *   */
    var setAutocaptureStatusUpdated = function( autocaptureStatusUpdated )
    {
        callbacks.autocaptureStatusUpdated = autocaptureStatusUpdated;
    };

    /** Sets the captured_image_updated.
     *  @param {String} capturedImageUpdated Callback with the captured
     *  image. The image format is the same as the preview image.
     *   */
    var setCapturedImageUpdated = function( capturedImageUpdated )
    {
        callbacks.capturedImageUpdated = capturedImageUpdated;
    };

    /** Sets the current_impression_updated.
     *  @param {String} currentImpressionUpdated Callback with the current
     *  impression.
     *   */
    var setCurrentImpressionUpdated = function( currentImpressionUpdated )
    {
        callbacks.currentImpressionUpdated = currentImpressionUpdated;
    };

    /** This function returns the manufacturer make from the active live
     *  scan device.
     *  
     *  @returns {Promise<String,Error>} The manufacturer make from the
     *  active live scan device.
     *   */
    var deviceGetMake = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_device_get_make";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** This function returns the manufacturer model from the active live
     *  scan device.
     *  
     *  @returns {Promise<String,Error>} The manufacturer model from the
     *  active live scan device.
     *   */
    var deviceGetModel = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_device_get_model";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };

    /** This function returns the serial number, or equivalent
     *  identification, from the active live scan device.
     *  
     *  @returns {Promise<String,Error>} The serial number, or equivalent
     *  identification, from the active live scan device.
     *   */
    var deviceGetSerialNumber = function( )
    {
        return new Promise( function( resolve, reject )
        {
            internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
            {
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_device_get_serial_number";
            jsonNode.args = [ ];
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
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_get_version";
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
                if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
                {
                    resolve( returnValue );
                }
                else
                {
                    var error = new Error( errorMessage );
                    error.errorCode = errorCode;
                    for ( var errorEntry in FingerprintCaptureApi.ErrorCode )
                    {
                        if ( FingerprintCaptureApi.ErrorCode[errorEntry] == errorCode )
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
            jsonNode.function = "aw_fingerprint_capture_get_version_string";
            jsonNode.args = [ ];
            transport.send( jsonNode );
        } );
    };




    var instance = {};
    instance.onMessage = onMessage;
    instance.channel = channel;
    instance.destroy = destroy;
    instance.openDevice = openDevice;
    instance.close = close;
    instance.calibrate = calibrate;
    instance.deviceIsCalibrated = deviceIsCalibrated;
    instance.setAutoCaptureConfiguration = setAutoCaptureConfiguration;
    instance.setCaptureResolution = setCaptureResolution;
    instance.getCaptureResolution = getCaptureResolution;
    instance.startAutoCapture = startAutoCapture;
    instance.disableAutoCapture = disableAutoCapture;
    instance.endAutoCapture = endAutoCapture;
    instance.captureImage = captureImage;
    instance.playOnCaptureAudio = playOnCaptureAudio;
    instance.playOnFailureAudio = playOnFailureAudio;
    instance.setFingerMissing = setFingerMissing;
    instance.resetMissingFingers = resetMissingFingers;
    instance.deviceGetProperty = deviceGetProperty;
    instance.deviceSetProperty = deviceSetProperty;
    instance.deviceEnableAudio = deviceEnableAudio;
    instance.getCapturedImage = getCapturedImage;
    instance.setDeviceStateUpdated = setDeviceStateUpdated;
    instance.setPreviewImageUpdated = setPreviewImageUpdated;
    instance.requestNextPreviewImage = requestNextPreviewImage;
    instance.setPreviewQualityScoreUpdated = setPreviewQualityScoreUpdated;
    instance.setAutocaptureStatusUpdated = setAutocaptureStatusUpdated;
    instance.setCapturedImageUpdated = setCapturedImageUpdated;
    instance.setCurrentImpressionUpdated = setCurrentImpressionUpdated;
    instance.deviceGetMake = deviceGetMake;
    instance.deviceGetModel = deviceGetModel;
    instance.deviceGetSerialNumber = deviceGetSerialNumber;
    instance.getVersion = getVersion;
    instance.getVersionString = getVersionString;

    return new Promise( function( resolve, reject )
    {
        internalStoreOnReturn( function( returnValue, errorCode, errorMessage )
        {
            if ( errorCode == FingerprintCaptureApi.ErrorCode.NO_ERRORS )
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
        jsonNode.function = "aw_fingerprint_capture_create";
        jsonNode.channel = channel;
        transport.send( jsonNode );
    } );
});

