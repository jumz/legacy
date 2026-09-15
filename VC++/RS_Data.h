/**
 *  Data Structure Definitions
 *
 *  @author Xperix
 *  @see    
 */

/*
 *  Copyright (c) 2023 Xperix Inc. All Rights Reserved.
 * 
 *  This software is the confidential and proprietary information of 
 *  Xperix Inc., Ltd. ("Confidential Information").  You shall not
 *  disclose such Confidential Information and shall use it only in
 *  accordance with the terms of the license agreement you entered into
 *  with Xperix.
 */

#ifndef __RS_DATA_H__
#define __RS_DATA_H__

#pragma pack(1)

//
// Device information
//
struct RSDeviceInfo {
	int deviceType;
	char productName[16];
	char deviceID[16];
	char firmwareVersion[16];
	char hardwareVersion[16];
	int reserved[32];
};

//
// SDK information
//
struct RSSDKInfo {
	char product[64];
	char version[16];
	char buildDate[16];
	int reserved[16];
};

typedef struct{
	int x, y;
} RS_POINT;

typedef unsigned int RS_COLORREF;

//
// Overlay data structures
//
struct RSOverlayText {
	RS_POINT	pos;
	unsigned	alignment;
	char		text[128];
	int			fontSize;
	char		fontName[32];
	RS_COLORREF	color;
	int			reserved[16];
};


struct RSOverlayCross {
	RS_POINT	centerPos;
	int			rangeX;
	int			rangeY;
	RS_COLORREF	color;
	int			width;
	int			reserved[16];
};


struct RSOverlayLine {
	RS_POINT	startPos;
	RS_POINT	endPos;
	RS_COLORREF	color;
	int			width;
	int			reserved[16];
};


struct RSOverlayQuadrangle {
	RS_POINT	pos[4];
	RS_COLORREF	color;
	int			width;
	int			reserved[16];
};

struct RSOverlayItem {
	int		itemType;
	union {
		RSOverlayText		text;
		RSOverlayCross		cross;
		RSOverlayLine		line;
		RSOverlayQuadrangle quadrangle;
	} item;
	int		deviceHandle;
	int		overlayHandle;
	bool	isShowing;
	int		reserved[16];
};

struct RSPoint {
	int x;
	int y;
};

//
// Slap information
//
struct RSSlapInfo {
	int fingerType; 
	RSPoint fingerPosition[4];
#ifndef RS_CONFIG_API_FOR_US
	int imageQuality;
#endif //RS_CONFIG_API_FOR_US
	int rotation;
	int reserved[3];
};

struct RSMissingInfo {
	int firstfinger;
	int secondfinger;
	int thirdfinger;
	int fourthfinger;
};

struct RSFingerInfo {
	int nFingerType;
	RSPoint sFingerPosition[4];
#ifndef RS_CONFIG_API_FOR_US
	int nImageQuality;
#endif //RS_CONFIG_API_FOR_US
	int nRotation;
	int nWidth;
	int nHeight;
	int nReserved;
};

struct RSSegmentInfo {
	int nFingerCnt;
	RSFingerInfo sFingerInfo[4];
};


#ifndef RS_CONFIG_API_FOR_US
//
// Frame-wise Quality information
//
typedef struct tag_RSFrameInfo {
	unsigned char* pImage;
	unsigned char* pQualityMap;
	int iWidth;
	int iHeight;
	int iNFIQ;
	int iQuality;
	int iLiveness;
} RSFrameInfo;
#endif //RS_CONFIG_API_FOR_US

#pragma pack()

//
// Left/Right Hand detection information
//
typedef enum{
	RS_LEFT_HAND	= -1001,
	RS_RIGHT_HAND	= -1002,
	RS_UNKOWN_HAND	= -1003,
}RSHandType;


#define RS_MAX_LFD_INFO	4
#define RS_LFD_LIVE 0
#define RS_LFD_FAKE 1

typedef struct _RS_LFD_INFO_
{
	int nResult;
	int nScore;
}RSLFDInfo, *PRSLFDInfo;

typedef struct _RS_LFD_RESULT_
{
	int nNumofFinger;
	RSLFDInfo arsLFDInfo[RS_MAX_LFD_INFO];
} RSLFDResult, *PRSLFDResult;



//
// ISO 19794-4
//


// Compression algorithm for 19794-4
#define RSE_COMP_19794_NONE						0x00
#define RSE_COMP_UNCOMPRESSED_BIT_PACKED		0x01
#define RSE_COMP_19794_WSQ						0x02
#define RSE_COMP_19794_JPEG						0x03
#define RSE_COMP_19794_JPEG2000					0x04
#define RSE_COMP_19794_PNG						0x05



//
// Finger position (ISO 19794-4)
//
#define RS_ISO19794_FGP_UNKNOWN					0
#define RS_ISO19794_FGP_RIGHT_THUMB				1
#define RS_ISO19794_FGP_RIGHT_INDEX				2
#define RS_ISO19794_FGP_RIGHT_MIDDLE			3
#define RS_ISO19794_FGP_RIGHT_RING				4
#define RS_ISO19794_FGP_RIGHT_LITTLE			5
#define RS_ISO19794_FGP_LEFT_THUMB				6
#define RS_ISO19794_FGP_LEFT_INDEX				7
#define RS_ISO19794_FGP_LEFT_MIDDLE				8
#define RS_ISO19794_FGP_LEFT_RING				9
#define RS_ISO19794_FGP_LEFT_LITTLE				10
#define RS_ISO19794_FGP_PLAIN_RIGHT_THUMB		11
#define RS_ISO19794_FGP_PLAIN_LEFT_THUMB		12
#define RS_ISO19794_FGP_PLAIN_RIGHT_FOUR		13
#define RS_ISO19794_FGP_PLAIN_LEFT_FOUR			14
#define RS_ISO19794_FGP_PLAIN_TWO_THUMBS		15
#define RS_ISO19794_FGP_EJI_OR_TIP				16

// Image quality (ISO 19794-4)
#define RS_ISO19794_IMAGE_QUALITY_FAIL					0x00 
#define RS_ISO19794_NO_IMAGE_QUALITY					0x00 
#define RS_ISO19794_IMAGE_QUALITY_NOT_REPORTED			254 
#define RS_ISO19794_IMAGE_QUALITY_COMPUTATION_FAIL		255

// Impression type (ISO 19794-4)
#define RS_ISO19794_IMP_LIVESCAN_PLAIN						0
#define RS_ISO19794_IMP_LIVESCAN_ROLLED						1
#define RS_ISO19794_IMP_NON_LIVESCAN_PLAIN					2 
#define RS_ISO19794_IMP_NON_LIVESCAN_ROLLED					3 
#define RS_ISO19794_IMP_LATENT								7 
#define RS_ISO19794_IMP_SWIPE								8 
#define RS_ISO19794_IMP_LIVESCAN_CONTACTLESS				9 
#define RS_ISO19794_IMP_LIVESCAN_OPTICAL_CONTACT_PLAIN		20
#define RS_ISO19794_IMP_LIVESCAN_OPTICAL_CONTACT_ROLLED		21
#define RS_ISO19794_IMP_OTHER								28
#define RS_ISO19794_IMP_UNKNOWN								29



#pragma pack(1)
/////////////////////////////////////////////////////////
// ISO 19794-4:2005
/////////////////////////////////////////////////////////
struct RSE19794ImageRecordHeader {
	enum {
		HEADER_LEN = 32,
	};

	char formatIdentifier[4];
	char versionNumber[4];
	unsigned int recordLength;
	unsigned int deviceTypeID;
	unsigned int imageAcquisitionLevel;
	unsigned int numberOfFingerImage;
	unsigned int scaleUnits;
	unsigned int horizScanResolution;
	unsigned int vertScanResolution;
	unsigned int horizImageResolution;
	unsigned int vertImageResolution;
	unsigned int pixelDepth;
	unsigned int imageCompressionAlgorithm;
	unsigned int reserved;

	unsigned char data[HEADER_LEN];

	void init();

	void convert();
	void convertFromData(unsigned char* newData);
};


struct RSE19794FingerRecordHeader {
	enum {
		HEADER_LEN = 14,
	};

	unsigned int fingerDataLength;
	unsigned int fingerPosition;
	unsigned int viewCounts;
	unsigned int viewNumber;
	unsigned int fingerImageQuality;
	unsigned int impressionType;
	unsigned int horizLineLength;
	unsigned int vertLineLength;
	int reserved;

	unsigned char data[HEADER_LEN];
	unsigned char* dataBuffer;
	int			   dataBufferLen;

	void init();

	void convert();
	void convertFromData(unsigned char* newData);
};




/////////////////////////////////////////////////////////
// ISO 19794-4:2011
/////////////////////////////////////////////////////////
struct RSE19794_4_GeneralHeader {
	enum {
		HEADER_LEN = 16,
	};

	char formatIdentifier[4];
	char versionNumber[4];
	unsigned int recordLength;
	unsigned short numberOfRepresentation;
	unsigned char certificationFlag;
	unsigned char numOfDistinctFinger;

	unsigned char data[HEADER_LEN];

	void init();

	void convert();
	//void convertFromData(unsigned char* newData);
};

struct RSE19794_4_QualityBlock {
	enum {
		HEADER_LEN = 5,
	};
	unsigned char qualityScore;
	unsigned short qualityAlgorithmVendorID;
	unsigned short qualityAlgorithmID;

	unsigned char data[HEADER_LEN];

	void convert();
};

struct RSE19794_4_CertificationBlock {

	enum {
		HEADER_LEN = 3,
	};
	unsigned short certificationAuthorityID;
	unsigned char certificationSchemeID;

	unsigned char data[HEADER_LEN];
	void convert();
};

struct RSE19794_4_RepresentationHeader {
	enum {
		HEADER_LEN = 41,
	};
	unsigned int representationLength;
	unsigned char captureDateNTime[9];
	unsigned char captureDeviceTechnologyId;
	unsigned short captureDeviceVendorID;
	unsigned short captureDeviceID;

	unsigned char qualityBlockCount;

	unsigned char fingerPosition;
	unsigned char representationNumber;

	unsigned char scaleUnits;
	unsigned short scanSpatialSamplingRateHorizontal;
	unsigned short scanSpatialSamplingRateVertical;
	unsigned short imageSpatialSamplingRateHorizontal;
	unsigned short imageSpatialSamplingRateVertial;
	unsigned char bitDepth;
	unsigned char imageCompressionAlgorithm;
	unsigned char impressionType;
	unsigned short horizontalLineLength;
	unsigned short verticalLineLength;
	unsigned int imageDataLength;

	unsigned char data[HEADER_LEN];

	void init();
	void convert();
};
	

#pragma pack()


#endif