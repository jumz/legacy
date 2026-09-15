/**
*  Error Codes
*
*  @author shcheong
*  @see
*/

/*
*  Copyright (c) 2021 Xperix Inc., Ltd. All Rights Reserved.
*
*  This software is the confidential and proprietary information of
*  Xperix Inc., Ltd. ("Confidential Information").  You shall not
*  disclose such Confidential Information and shall use it only in
*  accordance with the terms of the license agreement you entered into
*  with Xperix.
*/


#ifndef __RSE_DATA_H__
#define __RSE_DATA_H__

#include "RSE_Define.h"




struct RSEPoint {
	int x;
	int y;
};

//
// Slap information
//
struct RSESlapInfo {
	int fingerType;
	RSEPoint fingerPosition[4];
	int imageQuality;
	int rotation;
	int reserved[4];
};


/* characters in items */
struct RSEItem {
	int numBytes;   /* Always contains the current byte size of the entire */
					/* item including any trailing US separator.           */
	int numChars;   /* Number of characters currently in value, NOT  */
					/* including the NULL terminator.                */
	int allocChars; /* Number of allocated characters for the value, */
					/* including the NULL terminator.                */
	unsigned char *value;  /* Must keep NULL terminated.              */
	int usChar;
};

/* items in subfields */
struct RSESubfield {
	int numBytes;
	int numItems;
	int allocItems;
	RSEItem **items;
	int rsChar;
};

/* subfields in fields */
struct RSEField {
	char *id;
	unsigned int recordType;
	unsigned int fieldInt;
	int numBytes;
	int numSubfields;
	int allocSubfields;
	RSESubfield **subfields;
	int gsChar;
};

/* fields in records */
struct RSERecord {
	unsigned int type;
	int totalBytes;
	int numBytes;
	int numFields;
	int allocFields;
	RSEField **fields;
	int fsChar;
};

/* records in ANSI_NIST file */
struct RSEFile {
	unsigned int version;
	int numBytes;
	int numRecords;
	int allocRecords;
	RSERecord **records;
};


struct RSEType1Info {
	int recordLength; // read only
	char versionNumber[5];

	int numOfRecord; // read only
	int recordType[RSE_MAX_RECORD]; // read only
	int recordIDC[RSE_MAX_RECORD]; // read only

	char typeOfTranscation[5];
	char date[9];
	int priority; // optional, 0 for none
	char destinationAgencyIdentifier[32];
	char originatingAgencyIdentifier[32];
	char transactionControlNumber[32];
	char transactionControlReferenceNumber[32]; // optional 
	double nativeScanningResolution;
	double nominalTransmittingResolution;
	char domainName[32];	// optional
	char greenwichMeanTime[16]; // optional
	int characterSet;	// optional
};


struct RSEType2Info {
	int recordLength; // read only
	int IDC;
	char systemMaker[32];
	char systemModel[32];
	char serialNo[32];
};


struct RSEType4Info {
	int recordLength; // read only
	int IDC;
	int impressionType;
	char fingerPosition[6];
	int imageScanningResolution;
	int horizontalLine;
	int verticalLine;
	int compressionAlgorithm;
	int imageLen;
	unsigned char* imageData;
};


struct RSESegmentPosition {
	int fingerNumber;
	int left;
	int right;
	int top;
	int bottom;
};

struct RSEImageQuality {
	int fingerNumber;
	int score;
};


struct RSEType14Info {
	int recordLength; // read only
	int IDC;
	int impressionType;
	char sourceAgency[32];
	char captureDate[9];
	int horizontalLine;
	int verticalLine;
	int scaleUnit;
	int horizontalPixelScale;
	int verticalPixelScale;
	int compressionAlgorithm;
	int bpp;
	int numOfFingerPosition;
	int fingerPosition[6];
	int numOfSegment;
	RSESegmentPosition segPosition[4];
	int numOfQuality;
	RSEImageQuality imgQuality[4];
	int imageLen;
	unsigned char* imageData;
};



#endif