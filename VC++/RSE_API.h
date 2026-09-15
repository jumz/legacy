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

#ifndef __RSE_API_H__
#define __RSE_API_H__

#include "RSE_Error.h"
#include "RSE_Data.h"
#include "RSE_Define.h"


#ifdef WIN32
	#ifdef EXTENDEDSDK_EXPORTS
		#define REALSCANSDK_API __declspec(dllexport)
	#else
		#define REALSCANSDK_API __declspec(dllimport)
	#endif
#else
	#define REALSCANSDK_API
	#define __stdcall
#endif

#ifdef __cplusplus
extern "C"
{
#endif



//
// ANSI/NIST-ITL 1-2011 API
//
REALSCANSDK_API int __stdcall RSE_CreateFile(RSEType1Info* info, RSEFile** file);
REALSCANSDK_API int __stdcall RSE_ReadFile(const char* filename, RSEFile** file);
REALSCANSDK_API int __stdcall RSE_WriteFile(RSEFile* file, const char* filename);
REALSCANSDK_API int __stdcall RSE_FreeFile(RSEFile* file);

REALSCANSDK_API int __stdcall RSE_AppendRecord(RSEFile* file, RSERecord* record);
REALSCANSDK_API int __stdcall RSE_InsertRecord(RSEFile* file, int index, RSERecord* record);
REALSCANSDK_API int __stdcall RSE_DeleteRecord(RSEFile* file, int index);
REALSCANSDK_API int __stdcall RSE_ReadRecord(const char* recordFilename, int recordType, RSERecord** record);
REALSCANSDK_API int __stdcall RSE_WriteRecord(RSERecord* record, const char* recordFilename);
REALSCANSDK_API int __stdcall RSE_FreeRecord(RSERecord* record);

REALSCANSDK_API int __stdcall RSE_CreateRecord(int recordType, RSERecord** record);
REALSCANSDK_API int __stdcall RSE_CreateType2Record(RSEType2Info* info, RSERecord** record);
REALSCANSDK_API int __stdcall RSE_CreateType4Record(RSEType4Info* info, RSERecord** record);
REALSCANSDK_API int __stdcall RSE_CreateType14Record(RSEType14Info* info, RSERecord** record);
REALSCANSDK_API int __stdcall RSE_SetType1Info(const char* TOT, int priority, const char* DAI, const char* ORI, const char* TCN, const char* TCR, RSEType1Info* info);

REALSCANSDK_API int __stdcall RSE_CreateFileCS(RSEType1Info* info);
REALSCANSDK_API int __stdcall RSE_ReadFileCS(const char* filename);
REALSCANSDK_API int __stdcall RSE_WriteFileCS(const char* filename);
REALSCANSDK_API int __stdcall RSE_FreeFileCS();

REALSCANSDK_API int __stdcall RSE_AppendRecordCS();
REALSCANSDK_API int __stdcall RSE_InsertRecordCS(int index);
REALSCANSDK_API int __stdcall RSE_DeleteRecordCS(int index);
REALSCANSDK_API int __stdcall RSE_ReadRecordCS(const char* recordFilename, int recordType);
REALSCANSDK_API int __stdcall RSE_WriteRecordCS(const char* recordFilename);
REALSCANSDK_API int __stdcall RSE_FreeRecordCS();

REALSCANSDK_API int __stdcall RSE_CreateRecordCS(int recordType);
REALSCANSDK_API int __stdcall RSE_CreateType2RecordCS(RSEType2Info* info);
REALSCANSDK_API int __stdcall RSE_CreateType4RecordCS(RSEType4Info* info);
REALSCANSDK_API int __stdcall RSE_CreateType14RecordCS(RSEType14Info* info);

//REALSCANSDK_API int __stdcall RSE_MakeAN2007File(int deviceID, const char* leftSlapImageFile, const char* rightSlapImageFile, const char* twoThumbImageFile, int numOfRollFinger, int* rollFingerPosition, const char** rollFingerImageFile, const char* outputFile);
//REALSCANSDK_API int __stdcall RSE_MakeAN2007FileEx(int deviceID, RSEType1Info* info, const char* leftSlapImageFile, const char* rightSlapImageFile, const char* twoThumbImageFile, int numOfRollFinger, int* rollFingerPosition, const char** rollFingerImageFile, const char* outputFile);

//REALSCANSDK_API int __stdcall RSE_ConvertFileToText(const char* ansiFilename, const char* txtFilename);
//REALSCANSDK_API int __stdcall RSE_ConvertTextToFile(const char* txtFilename, const char* ansiFilename);





#ifdef __cplusplus
}
#endif



#endif