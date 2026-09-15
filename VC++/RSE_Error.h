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

#ifndef __RSE_ERROR_H__
#define __RSE_ERROR_H__

typedef enum {
	RSE_SUCCESS = 0,

	RSE_ERR_NO_DEVICE = -100,
	RSE_ERR_INVALID_PARAM = -101,
	RSE_ERR_CANNOT_READ_FILE = -102,
	RSE_ERR_CANNOT_WRITE_FILE = -103,
	RSE_ERR_UNSUPPORTED_FILE = -104,
	RSE_ERR_MEM_FULL = -105,

	RSE_ERR_CANNOT_SEGMENT = -200,
	RSE_ERR_CANNOT_GET_QUALITY = -201,
	RSE_ERR_NO_MATCH = -202,
	RSE_ERR_CANNOT_EXTRACT_TEMPLATE = -203,
	RSE_ERR_SEGMENT_WRONG_HAND = -204,
	RSE_ERR_SEGMENT_FEWER_FINGER = -205,

	RSE_ERR_CANNOT_GET_CONTRAST = -280,
	RSE_ERR_CANNOT_COMPRESS_WSQ = -300,
	RSE_ERR_CANNOT_DECOMPRESS_WSQ = -301,
	RSE_ERR_CANNOT_WRITE_WSQ_FILE = -302,
	RSE_ERR_WSQ_SIZE_LIMIT = -303,

	RSE_ERR_CANNOT_CREATE_ANSI_FILE = -400,
	RSE_ERR_CANNOT_READ_ANSI_FILE = -401,
	RSE_ERR_CANNOT_WRITE_ANSI_FILE = -402,

	RSE_ERR_CANNOT_CREATE_RECORD = -403,
	RSE_ERR_CANNOT_READ_RECORD = -404,
	RSE_ERR_CANNOT_WRITE_RECORD = -405,
	RSE_ERR_CANNOT_INSERT_RECORD = -406,
	RSE_ERR_CANNOT_DELETE_RECORD = -407,
	RSE_ERR_CANNOT_UPDATE_RECORD = -408,

	RSE_ERR_CANNOT_CREATE_FIELD = -409,
	RSE_ERR_CANNOT_APPEND_FIELD = -410,
	RSE_ERR_CANNOT_CREATE_SUBFIELD = -411,
	RSE_ERR_CANNOT_APPEND_SUBFIELD = -412,
	RSE_ERR_CANNOT_CREATE_ITEM = -413,
	RSE_ERR_CANNOT_APPEND_ITEM = -414,

} RSE_ERROR_CODE;

#endif
