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

#ifndef __RSE_DEFINE_H__
#define __RSE_DEFINE_H__

#define RSE_MAX_RECORD	32


// Image compression codes for ANSI/NIST
#define RSE_IMG_COMP_NONE	0
#define RSE_IMG_COMP_WSQ20	1
#define RSE_IMG_COMP_JPEGB	2
#define RSE_IMG_COMP_JPEGL	3
#define RSE_IMG_COMP_JP2	4
#define RSE_IMG_COMP_JP2L	5
#define RSE_IMG_COMP_PNG	6

// Impression type
#define RSE_IMP_LIVESCAN_PLAIN		0
#define RSE_IMP_LIVESCAN_ROLLED		1
#define RSE_IMP_NON_LIVESCAN_PLAIN					2 
#define RSE_IMP_NON_LIVESCAN_ROLLED					3 
#define RSE_IMP_LATENT								7 
#define RSE_IMP_SWIPE								8 
#define RSE_IMP_LIVESCAN_CONTACTLESS				9 
#define RSE_IMP_LIVESCAN_OPTICAL_CONTACT_PLAIN	20
#define RSE_IMP_LIVESCAN_OPTICAL_CONTACT_ROLLED	21
#define RSE_IMP_OTHER				28
#define RSE_IMP_UNKNOWN				29


//
// Finger position
//
#define RSE_FGP_UNKNOWN			0
#define RSE_FGP_RIGHT_THUMB		1
#define RSE_FGP_RIGHT_INDEX		2
#define RSE_FGP_RIGHT_MIDDLE	3
#define RSE_FGP_RIGHT_RING		4
#define RSE_FGP_RIGHT_LITTLE	5
#define RSE_FGP_LEFT_THUMB		6
#define RSE_FGP_LEFT_INDEX		7
#define RSE_FGP_LEFT_MIDDLE		8
#define RSE_FGP_LEFT_RING		9
#define RSE_FGP_LEFT_LITTLE		10
#define RSE_FGP_PLAIN_RIGHT_THUMB	11
#define RSE_FGP_PLAIN_LEFT_THUMB	12
#define RSE_FGP_PLAIN_RIGHT_FOUR	13
#define RSE_FGP_PLAIN_LEFT_FOUR		14
#define RSE_FGP_PLAIN_TWO_THUMBS	15
#define RSE_FGP_EJI_OR_TIP			16

// Slap type
#define RSE_SLAP_LEFT_FOUR				1
#define RSE_SLAP_RIGHT_FOUR				2
#define RSE_SLAP_FOUR_FINGER			3
#define RSE_SLAP_TWO_THUMB				4
#define RSE_SLAP_TWO_FINGER				5
#define RSE_SLAP_ONE_FINGER				6
#define RSE_SLAP_ONE_FINGER_ROLL		7 // since 2011.07.12

#endif