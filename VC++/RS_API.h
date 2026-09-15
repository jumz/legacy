/**
 *  RealScan SDK Main API V1.9.0
 *
 *  @author Xperix
 *  @see    
 */

/*
 *  Copyright (c) 2023 Xperix Inc. All Rights Reserved.
 * 
 *  This software is the confidential and proprietary information of 
 *  Xperix Inc. ("Confidential Information").  You shall not
 *  disclose such Confidential Information and shall use it only in
 *  accordance with the terms of the license agreement you entered into
 *  with Xperix.
 */
#pragma once

#ifndef __RS_API_H__
#define __RS_API_H__


#include "RS_Error.h"
#include "RS_Data.h"

#ifdef WIN32
	#include <atlimage.h>
	#if defined(__AFXSTR_H__) || defined(__ATLSTR_H__)
		#include <atlstr.h>
	#endif
	#ifdef REALSCANSDK_EXPORTS
		#define REALSCANSDK_API __declspec(dllexport)
	#else
		#define REALSCANSDK_API __declspec(dllimport)
	#endif
#else
	#define REALSCANSDK_API
	#define __stdcall
    typedef int BOOL;
#endif

//
// Device type
//
#define RS_DEVICE_REALSCAN_10                  0x00
#define RS_DEVICE_REALSCAN_10F                 0x01

#define RS_DEVICE_REALSCAN_D                   0x10
#define RS_DEVICE_REALSCAN_DF                  0x11

#define RS_DEVICE_REALSCAN_F                   0x20 
#define RS_DEVICE_REALSCAN_F_JP                0x21
#define RS_DEVICE_REALSCAN_F_CN                0x22 
#define RS_DEVICE_REALSCAN_F_C				   0x23 
#define RS_DEVICE_REALSCAN_F_C_IBIOS		   0x24

#define RS_DEVICE_REALSCAN_G10                 0x30 
#define RS_DEVICE_REALSCAN_G10F                0x31 
#define RS_DEVICE_REALSCAN_G1                  0x32
#define RS_DEVICE_REALSCAN_G10I                0x33

#define RS_DEVICE_REALSCAN_S60                 0x40
#define RS_DEVICE_UNKNOWN                      0xFF

//
// Initialization Mode
//
#define RS_INIT_HIDE_INIDLG                    0x01
#define RS_INIT_SHOW_INIDLG                    0x02
#define RS_INIT_FULL                           0x04   

//
// Capture mode
//
#define RS_CAPTURE_DISABLED                    0x00
#define RS_CAPTURE_ROLL_FINGER                 0x01
#define RS_CAPTURE_FLAT_SINGLE_FINGER          0x02
#define RS_CAPTURE_FLAT_TWO_FINGERS            0x03
#define RS_CAPTURE_FLAT_LEFT_FOUR_FINGERS      0x04
#define RS_CAPTURE_FLAT_RIGHT_FOUR_FINGERS     0x05
#define RS_CAPTURE_FLAT_LEFT_PALM              0x06 
#define RS_CAPTURE_FLAT_RIGHT_PALM             0x07 
#define RS_CAPTURE_FLAT_SINGLE_FINGER_EX       0x12
#define RS_CAPTURE_FLAT_TWO_FINGERS_EX         0x13 

#define RS_CAPTURE_FLAT_AREA_SETTING           0x20
#define RS_CAPTURE_FLAT_AREA_SETTING_PREV      0x21
#define RS_CAPTURE_FLAT_AREA_SETTING_PREV_ROI  0x22

#define RS_CAPTURE_ROLL_FINGER_EX              0x30 

#define RS_CAPTURE_FLAT_LEFT_SIDE_PALM         0x40 
#define RS_CAPTURE_FLAT_RIGHT_SIDE_PALM        0x41 
#define RS_CAPTURE_FLAT_LEFT_WRITERS_PALM      0x42 
#define RS_CAPTURE_FLAT_RIGHT_WRITERS_PALM     0x43 
#define RS_CAPTURE_FLAT_LEFT_UPPER_PALM        0x44
#define RS_CAPTURE_FLAT_RIGHT_UPPER_PALM       0x45
#define RS_CAPTURE_FLAT_LEFT_LOWER_PALM        0x46
#define RS_CAPTURE_FLAT_RIGHT_LOWER_PALM       0x47
	
// customized capture
#define RS_CAPTURE_ACCUMULATIVE_SEAL           0x50

#define RS_CAPTURE_FLAT_MANUAL_INI             0xfd
#define RS_CAPTURE_FLAT_MANUAL                 0xfe
#define RS_CAPTURE_ROLL_MANUAL                 0xff

// Capture Direction
#define RS_CAPTURE_DIRECTION_DEFAULT           0x00
#define RS_CAPTURE_DIRECTION_LEFT              0x01
#define RS_CAPTURE_DIRECTION_RIGHT             0x02


#define RS_CAPTURE_ROLL                        0x101
#define RS_CAPTURE_FLAT_THUMB                  0x102
#define RS_CAPTURE_FLAT_SLAP                   0x103
#define RS_CAPTURE_FLAT_PALM				   0x104
#define RS_CAPTURE_FLAT_SIDE_PALM              0x105
//
// Options for capturing flat fingers
//
#define RS_AUTO_SENSITIVITY_NORMAL             0x00
#define RS_AUTO_SENSITIVITY_HIGH               0x01
#define RS_AUTO_SENSITIVITY_HIGHER             0x02
#define RS_AUTO_SENSITIVITY_STRICT             0x03
#define RS_AUTO_SENSITIVITY_DISABLED           0x04

//
// Roll direction
//
#define	RS_ROLL_DIR_L2R                        0x00
#define RS_ROLL_DIR_R2L                        0x01
#define RS_ROLL_DIR_AUTO                       0x02
#define RS_ROLL_DIR_AUTO_M                     0x03 

//
// Roll profile
//
#define RS_ROLL_PROFILE_LOW                    0x01
#define RS_ROLL_PROFILE_NORMAL                 0x02
#define RS_ROLL_PROFILE_HIGH                   0x03

//
// Text alignment
//
#define RS_TEXT_ALIGN_LEFT                     0x00
#define RS_TEXT_ALIGN_CENTER                   0x01
#define RS_TEXT_ALIGN_RIGHT                    0x02

//
// Beeper pattern
//
#define RS_BEEP_PATTERN_NONE                   0
#define RS_BEEP_PATTERN_1                      1	// 1 short beep
#define RS_BEEP_PATTERN_2                      2	// 2 short beeps

// Beep Pattern Extended (RS-F CUSTOMIZED)
#define BEEP_PATTERN_NONE                      0   // No beep
#define BEEP_PATTERN_1                         1   // 1000000000000000 : means 1 short beep
#define BEEP_PATTERN_2                         2   // 1010000000000000 : means 2 short beeps
#define BEEP_PATTERN_3                         3   // 1111111111111111 : means a very long beep
#define BEEP_PATTERN_4                         4   // 1010101010101010 : means 8 short beeps
#define BEEP_PATTERN_5                         5   // 1100110011001100 : means 4 middle long beeps
#define BEEP_PATTERN_6                         6   // 1100000000000000 : means 1 middle long beep
#define BEEP_PATTERN_7                         7   // 1100110000000000 : means 2 middle long beeps
#define BEEP_PATTERN_8                         8   // 1110001110000000 : means 2 long beeps

//
// Keypad code
//
#define RS_REALSCAN10_NO_KEY                   0x00
#define RS_REALSCAN10_PLAY_KEY                 0x20
#define RS_REALSCAN10_STOP_KEY                 0x40
#define RS_REALSCAN10_ALL_KEYS                 0x7F

#define RS_REALSCAND_NO_KEY                    0x00
#define RS_REALSCAND_KEY_0                     0x20
#define RS_REALSCAND_ALL_KEYS                  0x7F

#define RS_REALSCANF_NO_KEY                    0x00 
#define RS_REALSCANF_UP_KEY                    0x01 
#define RS_REALSCANF_DOWN_KEY                  0x02 
#define RS_REALSCANF_LEFT_KEY                  0x04 
#define RS_REALSCANF_RIGHT_KEY                 0x08 
#define RS_REALSCANF_PLAY_KEY                  0x20 
#define RS_REALSCANF_STOP_KEY                  0x40 
#define RS_REALSCANF_FOOTSWITCH                0x80 
#define RS_REALSCANF_ALL_KEYS                  0xFF 

#define RS_REALSCANG10_NO_KEY                  0x00 
#define RS_REALSCANG10_PLAY_KEY                0x20 
#define RS_REALSCANG10_STOP_KEY                0x40 
#define RS_REALSCANG10_ALL_KEYS                0x7F 

// Keypad code for RS-F CUSTOMIZED
#define RS_REALSCANFJP_NO_KEY                  0x00
#define RS_REALSCANFJP_SKIP_KEY                0x01
#define RS_REALSCANFJP_START_KEY               0x02
#define RS_REALSCANFJP_CONFIRM_KEY             0x04
#define RS_REALSCANFFP_CHANGEDIR_KEY           0x08
#define RS_REALSCANFJP_FOOTSWITCH              0x80
#define RS_REALSCANFJP_ALL_KEYS                0xFF


//
// Finger Index
//
#define RS_FINGER_ALL                          0x00
#define RS_FINGER_LEFT_LITTLE                  0x01
#define RS_FINGER_LEFT_RING                    0x02
#define RS_FINGER_LEFT_MIDDLE                  0x03
#define RS_FINGER_LEFT_INDEX                   0x04
#define RS_FINGER_LEFT_THUMB                   0x05
#define RS_FINGER_RIGHT_THUMB                  0x06
#define RS_FINGER_RIGHT_INDEX                  0x07
#define RS_FINGER_RIGHT_MIDDLE                 0x08
#define RS_FINGER_RIGHT_RING                   0x09
#define RS_FINGER_RIGHT_LITTLE                 0x0A
#define RS_FINGER_TWO_THUMB                    0x0B
#define RS_FINGER_LEFT_FOUR                    0x0C
#define RS_FINGER_RIGHT_FOUR                   0x0D
#define RS_FINGER_TWO_LEFT1                    0x0E 
#define RS_FINGER_TWO_LEFT2                    0x0F 
#define RS_FINGER_TWO_RIGHT2                   0x10 
#define RS_FINGER_TWO_RIGHT1                   0x11 
#define RS_PALM_LEFT                           0x12 
#define RS_PALM_RIGHT                          0x13 

//
// Finger Mask
//
// bit-wise finger marks
//
//   1111 1001 1111
//
//   left      right
//   hand      hand
//       thumbs
//
#define RS_FINGER_M_ALL                        0xF9F
#define RS_FINGER_M_LEFT_LITTLE                0x800
#define RS_FINGER_M_LEFT_RING                  0x400
#define RS_FINGER_M_LEFT_MIDDLE                0x200
#define RS_FINGER_M_LEFT_INDEX                 0x100
#define RS_FINGER_M_LEFT_THUMB                 0x080
#define RS_FINGER_M_RIGHT_THUMB                0x010
#define RS_FINGER_M_RIGHT_INDEX                0x008
#define RS_FINGER_M_RIGHT_MIDDLE               0x004
#define RS_FINGER_M_RIGHT_RING                 0x002
#define RS_FINGER_M_RIGHT_LITTLE               0x001
#define RS_FINGER_M_TWO_THUMB                  0x090
#define RS_FINGER_M_LEFT_FOUR                  0xF00
#define RS_FINGER_M_RIGHT_FOUR                 0x00F
#define RS_FINGER_M_TWO_LEFT1                  0xC00
#define RS_FINGER_M_TWO_LEFT2                  0x300
#define RS_FINGER_M_TWO_RIGHT2                 0x00C
#define RS_FINGER_M_TWO_RIGHT1                 0x003

//
// Finger position for segmentation
//
#define RS_FGP_UNKNOWN                         0
#define RS_FGP_RIGHT_THUMB                     1
#define RS_FGP_RIGHT_INDEX                     2
#define RS_FGP_RIGHT_MIDDLE                    3
#define RS_FGP_RIGHT_RING                      4
#define RS_FGP_RIGHT_LITTLE                    5
#define RS_FGP_LEFT_THUMB                      6
#define RS_FGP_LEFT_INDEX                      7
#define RS_FGP_LEFT_MIDDLE                     8
#define RS_FGP_LEFT_RING                       9
#define RS_FGP_LEFT_LITTLE                     10
#define RS_FGP_PLAIN_RIGHT_THUMB               11
#define RS_FGP_PLAIN_LEFT_THUMB                12
#define RS_FGP_PLAIN_RIGHT_FOUR                13
#define RS_FGP_PLAIN_LEFT_FOUR                 14
#define RS_FGP_PLAIN_TWO_THUMBS                15
#define RS_FGP_EJI_OR_TIP                      16

//
// LED for RealScan-10
//
#define RS_LED_MODE_ALL                        0x00
#define RS_LED_MODE_LEFT_FINGER4               0x01
#define RS_LED_MODE_RIGHT_FINGER4              0x02
#define RS_LED_MODE_TWO_THUMB                  0x03
#define RS_LED_MODE_ROLL                       0x04
#define RS_LED_POWER                           0x05

// LED for RS-F CUSTOMIZED
#define RS_LED_MODE_SKIP                       0x01
#define RS_LED_MODE_START                      0x02
#define RS_LED_MODE_CONFIRM                    0x03	
#define RS_LED_MODE_CHANGE_DIRECTION           0x04

//
// LED Colors
//
#define RS_LED_OFF                             0x00
#define RS_LED_GREEN                           0x01
#define RS_LED_RED                             0x02
#define RS_LED_YELLOW                          0x03

//
// LED Status for S60
//
#define RS_S60_LED_STATUS_OFF 					0x00
#define RS_S60_LED_STATUS_RED 					0x01
#define RS_S60_LED_STATUS_GREEN 				0x02
#define RS_S60_LED_STATUS_YELLOW 				0x03
#define RS_S60_LED_STATUS_BLUE 					0x04
#define RS_S60_LED_STATUS_MAGENTA  				0x05
#define RS_S60_LED_STATUS_CYAN 					0x06
#define RS_S60_LED_STATUS_WHITE 				0x07

//
// LED Status for G1 
//
#define RS_LED_STATUS_OFF                      0x00
#define RS_LED_STATUS_ON                       0x01
#define RS_LED_STATUS_BLINK                    0x02

//
// Slap type
//
#define RS_SLAP_LEFT_FOUR                      1
#define RS_SLAP_RIGHT_FOUR                     2
#define RS_SLAP_FOUR_FINGER                    3
#define RS_SLAP_TWO_THUMB                      4
#define RS_SLAP_TWO_FINGER                     5
#define RS_SLAP_ONE_FINGER                     6
#define RS_SLAP_ONE_FINGER_ROLL                7 
#define RS_SLAP_MANUAL                         8
#define RS_SLAP_MANUAL_INI                     9
#define RS_SLAP_MANUAL_ROLL                    10
#define RS_SLAP_SEAL                           21

//
// Security level
//
#define RS_SECURITY_1_TO_100                   0x01 
#define RS_SECURITY_1_TO_1000                  0x02 
#define RS_SECURITY_1_TO_10000                 0x03
#define RS_SECURITY_1_TO_100000                0x04
#define RS_SECURITY_1_TO_1000000               0x05
#define RS_SECURITY_1_TO_10000000              0x06
#define RS_SECURITY_1_TO_100000000             0x07

//
// Contrast enhancement
//
#define RS_CONTRAST_ENHANCEMENT_DEFVALUE       0
#define RS_CONTRAST_ENHANCEMENT_MAXVALUE       40

//
// Self test type
//
#define RS_SELFTEST_ILLUMINATION               1
#define RS_SELFTEST_DIRT                       2

//
// LCD Display
//
#define RS_LCD_WIDTH_MAX                       320 
#define RS_LCD_HEIGHT_MAX                      240 
#define RS_LCD_DATA_SIZE_MAX                   153600 

//
// LFD On/Off
//
#define RS_LFD_OFF                             0
#define RS_LFD_ON                              1

// Not used currently, but it is not deleted for compatibility for old version SDK
#define RS_LFD_LEVEL_1                         1
#define RS_LFD_LEVEL_2                         2
#define RS_LFD_LEVEL_3                         3
#define RS_LFD_LEVEL_4                         4
#define RS_LFD_LEVEL_5                         5
#define RS_LFD_LEVEL_6                         6
#define RS_LFD_MANUAL                          7

//
// Preprocessing mode
//
#define RS_HIGH_CONTRAST_PREPROCESS            0x01
#define RS_HIGH_VISIBILITY_PREPROCESS          0x02
#define RS_BALANCED_PREPROCESS                 0x03
#define RS_FAST_PREPROCESS			           0x04

//
// Halo processing
//
#define RS_DIABLE_HALOPROCESS                  0x00
#define RS_ENABLE_HALOPROCESS                  0x01
#define RS_ENABLE_HALOPROCESSEX                0x02

//
// Variables
//
#define RS_VAR_PREVIEW_TYPE						1
#define RS_GVAR_WRN_LEVEL_TYPE					2
#define RS_GVAR_DIRTY_SENSITIVITY_TYPE			3

#ifndef RS_CONFIG_API_FOR_US
# define RS_GVAR_FP_QUALITY_MODE				4
#endif

//
// Variable types
//
typedef int RSPreviewType;

//
// Predefined constants
//
#define RS_VAR_PREVIEW_TYPE_NONE				0
#define RS_VAR_PREVIEW_TYPE_HALF				1
#define RS_VAR_PREVIEW_TYPE_FULL				2
#define RS_VAR_WRN_LEVEL_TYPE_DEFAULT			0
#define RS_VAR_DIRTY_SENSITIVITY_TYPE_DEFAULT	1
#define RS_VAR_DIRTY_SENSITIVITY_TYPE_MIN		1
#define RS_VAR_DIRTY_SENSITIVITY_TYPE_MAX		5

//
// Template type
//
#define UFE_TEMPLATE_TYPE_XPERIX		2001
#define UFE_TEMPLATE_TYPE_ISO19794_2	2002
#define UFE_TEMPLATE_TYPE_ANSI378		2003

//
// Device Status 
//
#define RS_DEVICE_STATUS_NONE		0
#define RS_DEVICE_STATUS_READY		1
#define RS_DEVICE_STATUS_CONNECTED	2

//
// Palm Type 
//
#define RS_PALM_TYPE_UNKNOWN		0
#define RS_PALM_TYPE_UPPER			1
#define RS_PALM_TYPE_LOWER			2


//
// Capture callback function
//

#if !(defined CImage) && !(defined __ATLIMAGE_H__)
	// linux Assumed
	#include <X11/X.h>
	#define CImage Pixmap
#endif //CImage




typedef void (__stdcall *RSCaptureCallback)( int deviceHandle, int captureResult, CImage* image );
typedef void (__stdcall *RSRawCaptureCallback)( int deviceHandle, int errorCode, unsigned char* imageData, int imageWidth, int imageHeight );
#ifndef RS_CONFIG_API_FOR_US
	typedef void (__stdcall *RSAdvRawCaptureCallback)( int deviceHandle, int errorCode, RSFrameInfo *frameInfo );
#endif //RS_CONFIG_API_FOR_US
typedef void (__stdcall *RSKeypadCallback)( int deviceHandle, unsigned keyCode );
#ifndef RS_CONFIG_API_FOR_US
	typedef void (__stdcall *RSAdvPreviewCallback)( int deviceHandle, int errorCode, unsigned char* imageData, int imageWidth, int imageHeight, int quality, int status );
#endif //RS_CONFIG_API_FOR_US
typedef void (__stdcall *RSFrameRateCallback)( int deviceHandle, int frameCnt, double sec ); 

#ifdef __cplusplus
extern "C" 
{
#endif

//
// Device APIs
//
REALSCANSDK_API int __stdcall RS_InitSDK( const char* configFileName, int option, int* numOfDevice );
#ifdef RS_CONFIG_RICH_API
	REALSCANSDK_API int __stdcall RS_ExitSDK();
#endif //RS_CONFIG_RICH_API
REALSCANSDK_API	int __stdcall RS_InitDevice( int deviceIndex, int*deviceHandle );
REALSCANSDK_API int __stdcall RS_ExitDevice( int deviceHandle );
REALSCANSDK_API int __stdcall RS_ExitAllDevices();
REALSCANSDK_API int __stdcall RS_GetDeviceInfo( int deviceHandle, RSDeviceInfo* deviceInfo );
#ifdef RS_CONFIG_RICH_API
	REALSCANSDK_API int __stdcall RS_UpgradeFirmware( int deviceHandle, unsigned char* firmware, int firmwareSize );
#endif //RS_CONFIG_RICH_API
REALSCANSDK_API int __stdcall RS_GetNumOfDevice(int* numOfDevice);
REALSCANSDK_API int __stdcall RS_GetDeviceHandle(int deviceIndex, int* deviceHandle);

//
// Capture APIs
//
REALSCANSDK_API int __stdcall RS_SetMinimumFinger( int deviceHandle, int minFingerCount );
REALSCANSDK_API int __stdcall RS_GetMinimumFinger( int deviceHandle, int *minFingerCount );

REALSCANSDK_API int __stdcall RS_SetCaptureMode( int deviceHandle, int captureMode, int captureOption, bool withModeLED );
REALSCANSDK_API int __stdcall RS_GetCaptureMode( int deviceHandle, int* captureMode, int* captureOption );

REALSCANSDK_API int __stdcall RS_SetManualCaptureMode( int deviceHandle, int imageX, int imageY, int imageWidth, int imageHeight, int captureOption, bool isFlat );
REALSCANSDK_API int __stdcall RS_GetManualCaptureMode(int deviceHandle, int* imageX, int* imageY, int* imageWidth, int* imageHeight, int* captureOption);

REALSCANSDK_API int __stdcall RS_SetCaptureModeWithDir( int deviceHandle, int captureMode, int captureDirection, int captureOption, bool withModeLED );
REALSCANSDK_API int __stdcall RS_GetCaptureModeWithDir( int deviceHandle, int* captureMode, int* captureDirection, int* captureOption );

REALSCANSDK_API int __stdcall RS_SetRollFingerOption( int deviceHandle, int rollDirection, int rollTime, int rollProfile );
REALSCANSDK_API int __stdcall RS_GetRollFingerOption( int deviceHandle, int* rollDirection, int* rollTime, int* rollProfile );

REALSCANSDK_API int __stdcall RS_GetImageSize( int deviceHandle, int* imageWidth, int* imageHeight );

REALSCANSDK_API int __stdcall RS_StartCapture( int deviceHandle, bool autoCapture, int timeout );
REALSCANSDK_API	int __stdcall RS_AbortCapture( int deviceHandle );
REALSCANSDK_API	int __stdcall RS_RegisterCaptureCallback( int deviceHandle, RSCaptureCallback captureCallback ); 
REALSCANSDK_API	int __stdcall RS_RegisterCaptureDataCallback( int deviceHandle, RSRawCaptureCallback captureCallback ); 
REALSCANSDK_API	int __stdcall RS_RegisterPreviewCallback( int deviceHandle, RSRawCaptureCallback captureCallback ); 
#ifndef RS_CONFIG_API_FOR_US
	REALSCANSDK_API	int __stdcall RS_RegisterAdvCaptureDataCallback( int deviceHandle, RSAdvRawCaptureCallback captureCallback ); 
	REALSCANSDK_API	int __stdcall RS_RegisterAdvPreviewCallback( int deviceHandle, RSAdvPreviewCallback captureCallback ); 
#endif //RS_CONFIG_API_FOR_US
REALSCANSDK_API	int __stdcall RS_RegisterFingerOnCallback( int deviceHandle, RSRawCaptureCallback captureCallback ); 

REALSCANSDK_API	int __stdcall RS_TakeImage( int deviceHandle, int timeout, CImage** image );
REALSCANSDK_API	int __stdcall RS_TakeImageData( int deviceHandle, int timeout, unsigned char** imageData, int* imageWidth, int* imageHeight );
REALSCANSDK_API int __stdcall RS_TakeImageDataSegment( int deviceHandle, int timeout, unsigned char** imageData, int* imageWidth, int* imageHeight,
													   int* captureResult, int slapType, int* numOfFinger, RSSlapInfo** slapInfo,
													   unsigned char*** fingerImageData, int** fingerImageWidth, int** fingerImageHeight );
REALSCANSDK_API int __stdcall RS_TakeImageDataSegmentWithSize( int deviceHandle, int timeout, unsigned char** imageData, int* imageWidth, int* imageHeight,
															   int* captureResult, int slapType, int* numOfFinger, RSSlapInfo** slapInfo,
															   unsigned char*** pCropImageData, int nCropWidth, int nCropHeight );
REALSCANSDK_API	int __stdcall RS_TakeImageEx( int deviceHandle, int timeout, int fingerIndex, bool withLED, CImage** image );
REALSCANSDK_API	int __stdcall RS_TakeImageDataEx( int deviceHandle, int timeout, int fingerIndex, bool withLED, unsigned char** imageData, int* imageWidth, int* imageHeight );
REALSCANSDK_API	int __stdcall RS_TakeCurrentImage( int deviceHandle, int timeout, CImage** image );
REALSCANSDK_API	int __stdcall RS_TakeCurrentImageData( int deviceHandle, int timeout, unsigned char** imageData, int* imageWidth, int* imageHeight );
REALSCANSDK_API	int __stdcall RS_TakeCurrentImageDataSegment( int deviceHandle, int timeout, unsigned char** imageData, int* imageWidth, int* imageHeight,
															  int* captureResult, int slapType, int* numOfFinger, RSSlapInfo** slapInfo,
															  unsigned char*** fingerImageData, int** fingerImageWidth, int** fingerImageHeight );
REALSCANSDK_API	int __stdcall RS_TakeCurrentImageDataSegmentWithSize( int deviceHandle, int timeout, unsigned char** imageData, int* imageWidth,
																	  int* imageHeight, int* captureResult, int slapType, int* numOfFinger,
																	  RSSlapInfo** slapInfo, unsigned char*** pCropImageData, int nCropWidth, int nCropHeight );
REALSCANSDK_API	int __stdcall RS_TakeCurrentImageEx( int deviceHandle, int timeout, int fingerIndex, bool withLED, CImage** image );
REALSCANSDK_API	int __stdcall RS_TakeCurrentImageDataEx( int deviceHandle, int timeout, int fingerIndex, bool withLED, unsigned char** imageData, int* imageWidth, int* imageHeight );

REALSCANSDK_API int __stdcall RS_Segment( unsigned char* imageData2, int imageWidth2, int imageHeight2, int slapType, int* numOfFinger, RSSlapInfo** slapInfo, 
										  unsigned char*** fingerImageData, int** fingerImageDataWidth, int** fingerImageDataHeight );
REALSCANSDK_API int __stdcall RS_SegmentWithSize( unsigned char* imageData, int imageWidth, int imageHeight, int slapType, int* numOfFinger, RSSlapInfo** slapInfo, 
												  unsigned char*** pCropImageData, int nCropWidth, int nCropHeight );
REALSCANSDK_API int __stdcall RS_SegmentMask( unsigned char* imageData, int imageWidth, int imageHeight, int fingerMask, int* numOfFinger,
											  RSSlapInfo** slapInfo, unsigned char*** fingerImageData, int** fingerImageDataWidth, int** fingerImageDataHeight );
REALSCANSDK_API int __stdcall RS_SegmentMaskEx( unsigned char* imageData, int imageWidth, int imageHeight,
												int fingerMask, int* numOfFinger, RSSlapInfo** slapInfo,
												unsigned char*** fingerImageData,
												int** fingerImageWidth, int** fingerImageHeight );

REALSCANSDK_API int __stdcall RS_Segment4( unsigned char* imageData, int imageWidth, int imageHeight, int slapType, int* numOfFinger, RSSlapInfo** slapInfo,
										   unsigned char** fingerImageData1, int* fingerImageDataWidth1, int* fingerImageDataHeight1,
										   unsigned char** fingerImageData2, int* fingerImageDataWidth2, int* fingerImageDataHeight2,
										   unsigned char** fingerImageData3, int* fingerImageDataWidth3, int* fingerImageDataHeight3,
										   unsigned char** fingerImageData4, int* fingerImageDataWidth4, int* fingerImageDataHeight4);

REALSCANSDK_API int __stdcall RS_Segment4WithSize( unsigned char* imageData, int imageWidth, int imageHeight, int slapType, int* numOfFinger, RSSlapInfo** slapInfo,
												   unsigned char** fingerImageData1, unsigned char** fingerImageData2, unsigned char** fingerImageData3, unsigned char** fingerImageData4,
												   int nCropWidth, int nCropHeight);

REALSCANSDK_API int __stdcall RS_SegmentImages( unsigned char* imageData, int imageWidth, int imageHeight, int slapType, int* numOfFinger,
											    RSSlapInfo** slapInfo, const char* outFilename );
REALSCANSDK_API int __stdcall RS_SegmentMissingFinger(
		unsigned char* imageData, int imageWidth, int imageHeight,
		int slapType, int* numOfFinger, RSSlapInfo** slapInfo,
		unsigned char*** fingerImageData, int** fingerImageDataWidth, int** fingerImageDataHeight,
		RSMissingInfo* missingInfo );
REALSCANSDK_API int __stdcall RS_SegmentMissingFingerEx(
		unsigned char* imageData, int imageWidth, int imageHeight,
		int slapType, int* numOfFinger, RSSlapInfo** slapInfo,
		unsigned char*** fingerImageData, int** fingerImageDataWidth, int** fingerImageDataHeight,
		RSMissingInfo* missingInfo );
REALSCANSDK_API int __stdcall RS_SegmentImagesMissingFinger(
		unsigned char* imageData, int imageWidth, int imageHeight,
		int slapType, int* numOfFinger, RSSlapInfo** slapInfo,
		const char* outFilename, RSMissingInfo* missingInfo );
REALSCANSDK_API int __stdcall RS_SegmentImagesMissingFingerEx(
		unsigned char* imageData, int imageWidth, int imageHeight,
		int slapType, int* numOfFinger, RSSlapInfo** slapInfo,
		const char* outFilename, RSMissingInfo* missingInfo );
#ifdef RS_CONFIG_RICH_API
	REALSCANSDK_API int __stdcall RS_Segment_HandDecision(unsigned char* imageData, int imageWidth, int imageHeight, int* handType, int* numOfFinger, RSSlapInfo** slapInfo,
														  unsigned char*** fingerImageData, int** fingerImageWidth, int** fingerImageHeight);
#endif //RS_CONFIG_RICH_API

#ifndef RS_CONFIG_API_FOR_US
REALSCANSDK_API int __stdcall RS_GetQualityScore( unsigned char* imageData, int imageWidth, int imageHeight, int* nistQuality );
REALSCANSDK_API int __stdcall RS_GetImageQualityScore( unsigned char* imageData, int imageWidth, int imageHeight, int* nQualityScore );
#endif //RS_CONFIG_API_FOR_US
REALSCANSDK_API int __stdcall RS_SequenceCheck( int numOfFinger, unsigned char** fingerImageData, int* fingerImageWidth, int* fingerImageHeight,
											    unsigned char* slapImageData, int slapImageWidth, int slapImageHeight, int slapType,
											    int* fingerSequenceInSlap, int securityLevel );
REALSCANSDK_API int __stdcall RS_SequenceCheckMissingFinger(
		int numOfFinger,
		unsigned char** fingerImageData, int* fingerImageWidth, int* fingerImageHeight,
		unsigned char* slapImageData, int slapImageWidth, int slapImageHeight,
		int slapType, int* fingerSequenceInSlap, int securityLevel , RSMissingInfo* missingInfo );
REALSCANSDK_API int __stdcall RS_SequenceCheckMissingFingerEx(
		int numOfFinger,
		unsigned char** fingerImageData, int* fingerImageWidth, int* fingerImageHeight,
		unsigned char* slapImageData, int slapImageWidth, int slapImageHeight,
		int slapType, int* fingerSequenceInSlap, int securityLevel , RSMissingInfo* missingInfo );

REALSCANSDK_API int __stdcall RS_FindTarget( unsigned char* queryImageData, int queryImageWidth, int queryImageHeight,
											 unsigned char* targetImageData0, int targetImageWidth0, int targetImageHeight0,
											 unsigned char* targetImageData1, int targetImageWidth1, int targetImageHeight1,
											 unsigned char* targetImageData2, int targetImageWidth2, int targetImageHeight2,
											 unsigned char* targetImageData3, int targetImageWidth3, int targetImageHeight3,
											 unsigned char* targetImageData4, int targetImageWidth4, int targetImageHeight4,
											 int securityLevel, int *matchedTargetIndex );
REALSCANSDK_API int __stdcall RS_SetSegRotateOption( bool isRotating );


REALSCANSDK_API	int __stdcall RS_Calibrate( int deviceHandle );
REALSCANSDK_API	int __stdcall RS_SetAutomaticCalibrate( int deviceHandle, bool automatic );
REALSCANSDK_API	int __stdcall RS_GetAutomaticCalibrate( int deviceHandle, bool* automatic );

REALSCANSDK_API	int __stdcall RS_SetAutomaticContrast( int deviceHandle, bool automatic );
REALSCANSDK_API	int __stdcall RS_GetAutomaticContrast( int deviceHandle, bool* automatic );

REALSCANSDK_API	int __stdcall RS_SetManualContrast( int deviceHandle, int contrastLevel );
REALSCANSDK_API	int __stdcall RS_GetManualContrast( int deviceHandle, int* contrastLevel );

REALSCANSDK_API	int __stdcall RS_SetPreProcessing(int deviceHandle, int preprocessMode); 
REALSCANSDK_API	int __stdcall RS_GetPreProcessing(int deviceHandle, int* preprocessMode); 

REALSCANSDK_API	int __stdcall RS_SetHaloProcessing(int deviceHandle, int haloprocessMode);
REALSCANSDK_API	int __stdcall RS_GetHaloProcessing(int deviceHandle, int* haloprocessMode);

REALSCANSDK_API	int __stdcall RS_SetAdvancedContrastEnhancement( int deviceHandle, bool enabled );
REALSCANSDK_API	int __stdcall RS_GetAdvancedContrastEnhancement( int deviceHandle, bool* enabled );

REALSCANSDK_API	int __stdcall RS_SetPostProcessing( int deviceHandle, bool contrastEnhancement, bool noiseReduction );
REALSCANSDK_API	int __stdcall RS_GetPostProcessing( int deviceHandle, bool* contrastEnhancement, bool* noiseReduction );

REALSCANSDK_API	int __stdcall RS_SetPostProcessingEx( int deviceHandle, bool contrastEnhancement, bool noiseReduction, int reductionLevel );
REALSCANSDK_API	int __stdcall RS_GetPostProcessingEx( int deviceHandle, bool* contrastEnhancement, bool* noiseReduction, int* reductionLevel );

REALSCANSDK_API int __stdcall RS_SelfTest( int deviceHandle, int testType ); 

#ifdef RS_CONFIG_RICH_API
	REALSCANSDK_API int __stdcall RS_CheckFrameRate( int deviceHandle, int palmType, const int frameCount, int* msInterval );
#endif //RS_CONFIG_RICH_API

REALSCANSDK_API int __stdcall RS_SetLFDLevel( int deviceHandle, int LFDLevel );
REALSCANSDK_API int __stdcall RS_GetLFDLevel( int deviceHandle, int* LFDLevel);
REALSCANSDK_API int __stdcall RS_GetLFDScore( int deviceHandle, int* LFDScore); 
REALSCANSDK_API int __stdcall RS_GetLFDScoreByImage(int deviceHandle, int* LFDScore, unsigned char* image, int width, int height);
REALSCANSDK_API int __stdcall RS_GetLFDResult(int deviceHandle, PRSLFDResult psLFDResult);

REALSCANSDK_API int __stdcall RS_SetParam( int deviceHandle, int type, void *variable );
REALSCANSDK_API int __stdcall RS_GetParam( int deviceHandle, int type, void *variable );

//
// VIEW APIs
//
#ifdef _WINDEF_
	REALSCANSDK_API int __stdcall RS_SetViewWindow( int deviceHandle, HWND windowHandle, RECT drawRectangle, bool autoContrast );
	REALSCANSDK_API int __stdcall RS_StopViewWindow( int deviceHandle );
	REALSCANSDK_API int __stdcall RS_SetViewWindow2( int deviceHandle, HWND windowHandle, RECT* drawRectangle, bool autoContrast );

	REALSCANSDK_API	int	__stdcall RS_AddOverlayText( int deviceHandle, RSOverlayText* text, int* overlayhandle );
	REALSCANSDK_API	int __stdcall RS_AddOverlayCross( int deviceHandle, RSOverlayCross* cross, int* overlayHandle );
	REALSCANSDK_API int __stdcall RS_AddOverlayLine( int deviceHandle, RSOverlayLine* line, int* overlayHandle );
	REALSCANSDK_API	int __stdcall RS_AddOverlayQuadrangle( int deviceHandle, RSOverlayQuadrangle* quadrangle, int* overlayHandle );
	REALSCANSDK_API int __stdcall RS_ShowOverlay( int overlayHandle, bool show );
	REALSCANSDK_API int __stdcall RS_ShowAllOverlay( int deviceHandle, bool show );
	REALSCANSDK_API	int __stdcall RS_RemoveOverlay( int overlayHandle );
	REALSCANSDK_API	int __stdcall RS_RemoveAllOverlay( int deviceHandle );
#endif //_WINDEF_

//
// I/O
//
REALSCANSDK_API	int __stdcall RS_SetActiveKey( int deviceHandle, unsigned keyMask );
REALSCANSDK_API int __stdcall RS_GetKeyStatus( int deviceHandle, unsigned* keyCode );
REALSCANSDK_API int __stdcall RS_RegisterKeypadCallback( int deviceHandle, RSKeypadCallback callback );

REALSCANSDK_API	int __stdcall RS_Beep( int deviceHandle, int beepPattern );
REALSCANSDK_API	int __stdcall RS_SetCaptureBeep( int deviceHandle, int startingBeep, int successBeep, int failBeep );

REALSCANSDK_API	int __stdcall RS_SetFingerLED( int deviceHandle, int fingerIndex, int ledColor );
REALSCANSDK_API	int __stdcall RS_SetModeLED( int deviceHandle, int ledIndex, bool isOn );
REALSCANSDK_API	int __stdcall RS_SetStatusLED( int deviceHandle, int ledCode );

REALSCANSDK_API int __stdcall RS_PlayWav( int deviceHandle, const char* wavFile );
REALSCANSDK_API int __stdcall RS_PlayWavMem( int deviceHandle, unsigned char* wavData, int wavDataLen );

REALSCANSDK_API int __stdcall RS_TurnOnBacklight_RSF(int deviceHandle, bool isON);

REALSCANSDK_API int __stdcall RS_ResetDevice(int deviceHandle );
REALSCANSDK_API int __stdcall RS_PowerCheck(int deviceHandle, unsigned* powerType );

//
// RS-F_JP, RS-F CN only
//
REALSCANSDK_API int __stdcall RS_DisplayLCD( int deviceHandle, unsigned char* data, int dataLen, int sx, int sy, int width, int height );
REALSCANSDK_API int __stdcall RS_MakeLCDData( unsigned char* inputRData, unsigned char* inputGData, unsigned char* inputBData, int inputWidth, int inputHeight, unsigned char** outputData );
REALSCANSDK_API int __stdcall RS_ResetLCD( int deviceHandle );

REALSCANSDK_API int __stdcall RS_GetTempInfo(int deviceHandle, float* caseTemp, float* PLTemp, float* PRTemp);
REALSCANSDK_API int __stdcall RS_GetTempTimeInfo(int deviceHandle, unsigned int* BTime, unsigned int* HTime);

//
// Misc.
//
REALSCANSDK_API int __stdcall RS_GetSDKInfo( RSSDKInfo* sdkInfo );
#if defined(__AFXSTR_H__) || defined(__ATLSTR_H__)
	REALSCANSDK_API int __stdcall RS_GetErrString( int errorCode, CString& errorMsg );
	REALSCANSDK_API int __stdcall RS_GetCaptureStatusString( int statusCode, CString& statusMsg );
	REALSCANSDK_API int __stdcall RS_GetErrStringChar( int errorCode, char* errorMsg );
	REALSCANSDK_API int __stdcall RS_GetCaptureStatusStringChar( int statusCode, char* statusMsg );
#else
	REALSCANSDK_API int __stdcall RS_GetErrString( int errorCode, char* errorMsg );
	REALSCANSDK_API int __stdcall RS_GetCaptureStatusString( int statusCode, char* statusMsg );
#endif //no __AFXSTR_H__ or __ATLSTR_H__

REALSCANSDK_API void __stdcall RS_FreeImageData( void* imageData );
REALSCANSDK_API int __stdcall RS_SaveBitmap( unsigned char* pixelData, int imageWidth, int imageHeight, const char* filename );
REALSCANSDK_API int __stdcall RS_SaveBitmapMem( unsigned char* pixelData, int imageWidth, int imageHeight, unsigned char* imageBuffer );
#ifdef RS_CONFIG_RICH_API
	REALSCANSDK_API int __stdcall RS_SaveRawfile( unsigned char* pixelData, int imageWidth, int imageHeight, const char* filename );
#endif //RS_CONFIG_RICH_API

REALSCANSDK_API int __stdcall RS_EncodeWSQ(unsigned char* rawBuffer, int width, int height, const float ratio, unsigned char* wsqBuffer, int* wsqBufferLen);
REALSCANSDK_API int __stdcall RS_DecodeWSQ(unsigned char* wsqBuffer, int wsqBufferLen, unsigned char* rawBuffer, int* rawBufferLen, int* width, int* hight);
REALSCANSDK_API int __stdcall RS_EncodeJP2(unsigned char* rawBuffer, int width, int height, unsigned char* jp2Buffer, int* jp2BufferLen);

REALSCANSDK_API int __stdcall RS_CheckFingerPosition(int deviceHandle, const unsigned char* imageData, const int imageWidth, const int imageHeight);
#ifndef RS_CONFIG_API_FOR_US
	REALSCANSDK_API int __stdcall RS_CheckPalmQuality(const unsigned char* imageData, const int imageWidth, const int imageHeight, const int palmType, int *qualityScore);
#endif //RS_CONFIG_API_FOR_US
REALSCANSDK_API int __stdcall RS_EnableFingerPositionGuidance( int deviceHandle, bool bEnable );


REALSCANSDK_API int __stdcall RS_IsFinger(int deviceHandle, unsigned char* imageData, int imageWidth, int imageHeight);
REALSCANSDK_API int __stdcall RS_GetCurrentProcessedImage(int deviceHandle, unsigned char* imageData);
REALSCANSDK_API int __stdcall RS_GetCurrentSynthesisImage(int deviceHandle, unsigned char* imageData);
REALSCANSDK_API int __stdcall RS_IsCapturing( int deviceHandle, BOOL* isRunning);

REALSCANSDK_API int __stdcall RS_Command( int deviceHandle, long long cmd );

REALSCANSDK_API int __stdcall RS_CheckCustomID(int deviceHandle, char* customId); // added by jsh 
REALSCANSDK_API int __stdcall RS_SetModeLEDColor(int deviceHandle, int LEDColorMask); // added by jsh - 2020.12.07

REALSCANSDK_API int __stdcall RS_GetTemplate(int templateType, unsigned char* imageData, int imageWidth, int imageHeight, unsigned char* pTemplate, int* pnTemplateSize);

REALSCANSDK_API int __stdcall RS_GenerateIso19794_4_2011(int deviceType,
	unsigned char* imageBuffer,
	int	imageBufferLen,
	int imageWidth,
	int imageHeight,
	int fingerPosition,
	int nCompressionMode,
	unsigned char* output,
	int* outputLen);

REALSCANSDK_API int __stdcall RS_GenerateIso19794_4_2011Ex(int deviceType,
	unsigned char* imageBuffer,
	int	imageBufferLen,
	int imageWidth,
	int imageHeight,
	int fingerPosition,
	int nCompressionMode,
	unsigned char** output,
	int* outputLen);


REALSCANSDK_API int __stdcall RS_GenerateIso19794_4_2005(int deviceType,
	unsigned char* imageBuffer,
	int	imageBufferLen,
	int imageWidth,
	int imageHeight,
	int fingerPosition,
	int nCompressionMode,
	unsigned char* output,
	int* outputLen);

REALSCANSDK_API int __stdcall RS_GenerateIso19794_4_2005Ex(int deviceType,
	unsigned char* imageBuffer,
	int	imageBufferLen,
	int imageWidth,
	int imageHeight,
	int fingerPosition,
	int nCompressionMode,
	unsigned char** output,
	int* outputLen);

REALSCANSDK_API int __stdcall RS_GenerateIso19794_4_2011_WithCBEFF(int deviceType,
	unsigned char* imageBuffer,
	int	imageBufferLen,
	int imageWidth,
	int imageHeight,
	int fingerPosition,
	int nCompressionMode,
	unsigned char* output,
	int* outputLen);

REALSCANSDK_API int __stdcall RS_GenerateIso19794_4_2011_WithCBEFFEx(int deviceType,
	unsigned char* imageBuffer,
	int	imageBufferLen,
	int imageWidth,
	int imageHeight,
	int fingerPosition,
	int nCompressionMode,
	unsigned char** output,
	int* outputLen);




REALSCANSDK_API int __stdcall RS_WriteEEPROM(int deviceHandle, unsigned int nStartROMAddr, unsigned int dataLen, unsigned char* data);
REALSCANSDK_API int __stdcall RS_ReadEEPROM(int deviceHandle, unsigned int nStartROMAddr, unsigned int dataLen, unsigned char** data);
//REALSCANSDK_API int __stdcall RS_ReduceHalo(unsigned char* rawBuffer, int width, int height, unsigned char* outputBuffer);

#ifdef WIN32

typedef void(__stdcall *RSHotPluggingCallback)(int deviceId, bool isConnected);

REALSCANSDK_API int __stdcall RS_StartHotPlugging();

REALSCANSDK_API int __stdcall RS_GetDeviceId(int deviceIndex, int* deviceId);
REALSCANSDK_API int __stdcall RS_GetDeviceStatus(int deviceId, int* deviceHandle, int* deviceType, int* deviceStatus);
REALSCANSDK_API int __stdcall RS_InitDeviceById(int deviceId, int* deviceHandle);

REALSCANSDK_API	int __stdcall RS_RegisterHotPluggingCallback(RSHotPluggingCallback hotPluggingCallback);
#endif

REALSCANSDK_API	int __stdcall RS_CheckPalmType(int deviceHandle, unsigned char* imageData2, int imageWidth2, int imageHeight2, int* palmType, bool enhancedMode = true);
REALSCANSDK_API int __stdcall RS_SaveNistItl2011(int deviceType, int captureMode, unsigned char* imageData, int imageWidth, int imageHeight, const char* filename);

#ifdef __cplusplus
}
#endif

#endif
