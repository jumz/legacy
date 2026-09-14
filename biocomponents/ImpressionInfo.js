/* Copyright (C) 2021 Aware, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

var ImpressionInfo = {};

ImpressionInfo[FingerprintCaptureApi.Impression.ROLLED_RIGHT_THUMB] = {
    name: "Rolled right thumb",
    isPlain: false,
    isRoll: true,
    fingersCodes: [1],
    hand: "right"
};

ImpressionInfo[FingerprintCaptureApi.Impression.ROLLED_RIGHT_INDEX_FINGER] = {
    name: "Rolled right index",
    isPlain: false,
    isRoll: true,
    fingersCodes: [2],
    hand: "right"
};

ImpressionInfo[FingerprintCaptureApi.Impression.ROLLED_RIGHT_MIDDLE_FINGER] = {
    name: "Rolled right middle",
    isPlain: false,
    isRoll: true,
    fingersCodes: [3],
    hand: "right"
};

ImpressionInfo[FingerprintCaptureApi.Impression.ROLLED_RIGHT_RING_FINGER] = {
    name: "Rolled right ring",
    isPlain: false,
    isRoll: true,
    fingersCodes: [4],
    hand: "right"
};

ImpressionInfo[FingerprintCaptureApi.Impression.ROLLED_RIGHT_LITTLE_FINGER] = {
    name: "Rolled right little",
    isPlain: false,
    isRoll: true,
    fingersCodes: [5],
    hand: "right"
};

ImpressionInfo[FingerprintCaptureApi.Impression.ROLLED_LEFT_THUMB] = {
    name: "Rolled left thumb",
    isPlain: false,
    isRoll: true,
    fingersCodes: [6],
    hand: "left"
};

ImpressionInfo[FingerprintCaptureApi.Impression.ROLLED_LEFT_INDEX_FINGER] = {
    name: "Rolled left index",
    isPlain: false,
    isRoll: true,
    fingersCodes: [7],
    hand: "left"
};

ImpressionInfo[FingerprintCaptureApi.Impression.ROLLED_LEFT_MIDDLE_FINGER] = {
    name: "Rolled left middle",
    isPlain: false,
    isRoll: true,
    fingersCodes: [8],
    hand: "left"
};

ImpressionInfo[FingerprintCaptureApi.Impression.ROLLED_LEFT_RING_FINGER] = {
    name: "Rolled left ring",
    isPlain: false,
    isRoll: true,
    fingersCodes: [9],
    hand: "left"
};

ImpressionInfo[FingerprintCaptureApi.Impression.ROLLED_LEFT_LITTLE_FINGER] = {
    name: "Rolled left little",
    isPlain: false,
    isRoll: true,
    fingersCodes: [10],
    hand: "left"
};

ImpressionInfo[FingerprintCaptureApi.Impression.PLAIN_RIGHT_THUMB] = {
    name: "Plain right thumb",
    isPlain: true,
    isRoll: false,
    fingersCodes: [1],
    hand: "right"
};
ImpressionInfo[FingerprintCaptureApi.Impression.PLAIN_LEFT_THUMB] = {
    name: "Plain left thumb",
    isPlain: true,
    isRoll: false,
    fingersCodes: [6],
    hand: "left"
};
ImpressionInfo[FingerprintCaptureApi.Impression.PLAIN_RIGHT_FOUR_FINGERS] = {
    name: "Plain right four fingers",
    isPlain: true,
    isRoll: false,
    fingersCodes: [2, 3, 4, 5],
    plainCodes: [80, 81, 82, 83],
    slapCodes: [15, 16, 17, 18],
    hand: "right"
};
ImpressionInfo[FingerprintCaptureApi.Impression.PLAIN_LEFT_FOUR_FINGERS] = {
    name: "Plain left four fingers",
    isPlain: true,
    isRoll: false,
    fingersCodes: [10, 9, 8, 7],
    plainCodes: [87, 86, 85, 84],
    slapCodes: [22, 21, 20, 19],
    hand: "left"
};
ImpressionInfo[FingerprintCaptureApi.Impression.RIGHT_SLAP_INDEX_FINGER] = {
    name: "Right slap index finger",
    isPlain: true,
    isRoll: false,
    fingersCodes: [2]
};
ImpressionInfo[FingerprintCaptureApi.Impression.RIGHT_SLAP_MIDDLE_FINGER] = {
    name: "Right slap index finger",
    isPlain: true,
    isRoll: false,
    fingersCodes: [3],
    hand: "right"
};
ImpressionInfo[FingerprintCaptureApi.Impression.RIGHT_SLAP_RING_FINGER] = {
    name: "Right slap index finger",
    isPlain: true,
    isRoll: false,
    fingersCodes: [4],
    hand: "right"
};
ImpressionInfo[FingerprintCaptureApi.Impression.RIGHT_SLAP_LITTLE_FINGER] = {
    name: "Right slap index finger",
    isPlain: true,
    isRoll: false,
    fingersCodes: [5],
    hand: "right"
};
ImpressionInfo[FingerprintCaptureApi.Impression.LEFT_SLAP_INDEX_FINGER] = {
    name: "Left slap index finger",
    isPlain: true,
    isRoll: false,
    fingersCodes: [7],
    hand: "left"
};
ImpressionInfo[FingerprintCaptureApi.Impression.LEFT_SLAP_MIDDLE_FINGER] = {
    name: "Left slap middle finger",
    isPlain: true,
    isRoll: false,
    fingersCodes: [8],
    hand: "left"
};
ImpressionInfo[FingerprintCaptureApi.Impression.LEFT_SLAP_RING_FINGER] = {
    name: "Left slap ring finger",
    isPlain: true,
    isRoll: false,
    fingersCodes: [9],
    hand: "left"
};

ImpressionInfo[FingerprintCaptureApi.Impression.LEFT_SLAP_LITTLE_FINGER] = {
    name: "Left slap little finger",
    isPlain: true,
    isRoll: false,
    fingersCodes: [10],
    hand: "left"
};

ImpressionInfo[FingerprintCaptureApi.Impression.PLAIN_DUAL_THUMBS] = {
    name: "Plain dual thumbs",
    isPlain: true,
    isRoll: false,
    fingersCodes: [6, 1],
    plainCodes: [12, 11],
    slapCodes: [33, 32],
    hand: "both"
};

ImpressionInfo[FingerprintCaptureApi.Impression.PLAIN_DUAL_THUMBS_RIGHT] = {
    name: "Plain dual thumbs right",
    isPlain: true,
    isRoll: false,
    fingersCodes: [1],
    hand: "right"
};

ImpressionInfo[FingerprintCaptureApi.Impression.PLAIN_DUAL_THUMBS_LEFT] = {
    name: "Plain dual thumbs left",
    isPlain: true,
    isRoll: false,
    fingersCodes: [6]
};

ImpressionInfo[FingerprintCaptureApi.Impression.PLAIN_RIGHT_INDEX_FINGER] = {
    name: "Plain right index finger",
    isPlain: true,
    isRoll: false,
    fingersCodes: [2],
    hand: "right"
};

ImpressionInfo[FingerprintCaptureApi.Impression.PLAIN_RIGHT_MIDDLE_FINGER] = {
    name: "Plain right middle finger",
    isPlain: true,
    isRoll: false,
    fingersCodes: [3],
    hand: "right"
};

ImpressionInfo[FingerprintCaptureApi.Impression.PLAIN_RIGHT_RING_FINGER] = {
    name: "Plain right ring finger",
    isPlain: true,
    isRoll: false,
    fingersCodes: [4],
    hand: "right"
};

ImpressionInfo[FingerprintCaptureApi.Impression.PLAIN_RIGHT_LITTLE_FINGER] = {
    name: "Plain right little finger",
    isPlain: true,
    isRoll: false,
    fingersCodes: [5],
    hand: "right"
};

ImpressionInfo[FingerprintCaptureApi.Impression.PLAIN_LEFT_INDEX_FINGER] = {
    name: "Plain left index finger",
    isPlain: true,
    isRoll: false,
    fingersCodes: [7],
    hand: "left"
};

ImpressionInfo[FingerprintCaptureApi.Impression.PLAIN_LEFT_MIDDLE_FINGER] = {
    name: "Plain left middle finger",
    isPlain: true,
    isRoll: false,
    fingersCodes: [8],
    hand: "left"
};

ImpressionInfo[FingerprintCaptureApi.Impression.PLAIN_LEFT_RING_FINGER] = {
    name: "Plain left ring finger",
    isPlain: true,
    isRoll: false,
    fingersCodes: [9],
    hand: "left"
};

ImpressionInfo[FingerprintCaptureApi.Impression.PLAIN_LEFT_LITTLE_FINGER] = {
    name: "Plain left little finger",
    isPlain: true,
    isRoll: false,
    fingersCodes: [10],
    hand: "left"
};

ImpressionInfo[FingerprintCaptureApi.Impression.FIRST_TWO_FINGER_LEFT] = {
    name: "First two fingers left",
    isPlain: true,
    isRoll: false,
    fingersCodes: [8, 7],
    plainCodes: [85, 84],
    slapCodes: [67, 66],
    hand: "left"
};

ImpressionInfo[FingerprintCaptureApi.Impression.FIRST_TWO_FINGER_RIGHT] = {
    name: "First two fingers right",
    isPlain: true,
    isRoll: false,
    fingersCodes: [2, 3],
    plainCodes: [80, 81],
    slapCodes: [63, 64],
    hand: "right"
};

ImpressionInfo[FingerprintCaptureApi.Impression.SECOND_TWO_FINGER_RIGHT] = {
    name: "Second two finger right.",
    isPlain: true,
    isRoll: false,
    fingersCodes: [3, 4],
    plainCodes: [81, 82],
    slapCodes: [69, 70],
    hand: "right"
};
ImpressionInfo[FingerprintCaptureApi.Impression.SECOND_TWO_FINGER_LEFT] = {
    name: "Second two finger left.",
    isPlain: true,
    isRoll: false,
    fingersCodes: [8, 9],
    plainCodes: [85, 86],
    slapCodes: [72, 73],
    hand: "left"
};
ImpressionInfo[FingerprintCaptureApi.Impression.THIRD_TWO_FINGER_RIGHT] = {
    name: "Third two finger right.",
    isPlain: true,
    isRoll: false,
    fingersCodes: [4, 5],
    plainCodes: [80, 83],
    slapCodes: [75, 76],
    hand: "right"
};
ImpressionInfo[FingerprintCaptureApi.Impression.THIRD_TWO_FINGER_LEFT] = {
    name: "Third two finger left.",
    isPlain: true,
    isRoll: false,
    fingersCodes: [9, 10],
    plainCodes: [86, 87],
    slapCodes: [78, 79],
    hand: "left"
};
ImpressionInfo[FingerprintCaptureApi.Impression.DUAL_INDEX] = {
    name: "Dual index.",
    isPlain: true,
    isRoll: false,
    fingersCodes: [2, 7],
    plainCodes: [80, 84],
    slapCodes: [116, 115],
    hand: "right"
};
ImpressionInfo[FingerprintCaptureApi.Impression.FIRST_TWO_FINGER_RIGHT_INDEX_FINGER] = {
    name: "First two finger right index finger.",
    isPlain: true,
    isRoll: false,
    fingersCodes: [2],
    hand: "right"
};
ImpressionInfo[FingerprintCaptureApi.Impression.FIRST_TWO_FINGER_RIGHT_MIDDLE_FINGER] = {
    name: "First two finger right middle finger.",
    isPlain: true,
    isRoll: false,
    fingersCodes: [3],
    hand: "right"
};
ImpressionInfo[FingerprintCaptureApi.Impression.FIRST_TWO_FINGER_LEFT_INDEX_FINGER] = {
    name: "First two finger left index finger.",
    isPlain: true,
    isRoll: false,
    fingersCodes: [7],
    hand: "left"
};
ImpressionInfo[FingerprintCaptureApi.Impression.FIRST_TWO_FINGER_LEFT_MIDDLE_FINGER] = {
    name: "First two finger left middle finger.",
    isPlain: true,
    isRoll: false,
    fingersCodes: [8],
    hand: "left"
};
ImpressionInfo[FingerprintCaptureApi.Impression.SECOND_TWO_FINGER_RIGHT_MIDDLE_FINGER] = {
    name: "Second two finger right middle finger.",
    isPlain: true,
    isRoll: false,
    fingersCodes: [3],
    hand: "right"
};
ImpressionInfo[FingerprintCaptureApi.Impression.SECOND_TWO_FINGER_RIGHT_RING_FINGER] = {
    name: "Second two finger right ring finger.",
    isPlain: true,
    isRoll: false,
    fingersCodes: [4],
    hand: "right"
};
ImpressionInfo[FingerprintCaptureApi.Impression.SECOND_TWO_FINGER_LEFT_MIDDLE_FINGER] = {
    name: "Second two finger left middle finger.",
    isPlain: true,
    isRoll: false,
    fingersCodes: [8],
    hand: "left"
};
ImpressionInfo[FingerprintCaptureApi.Impression.SECOND_TWO_FINGER_LEFT_RING_FINGER] = {
    name: "Second two finger left ring finger.",
    isPlain: true,
    isRoll: false,
    fingersCodes: [9],
    hand: "left"
};
ImpressionInfo[FingerprintCaptureApi.Impression.THIRD_TWO_FINGER_RIGHT_RING_FINGER] = {
    name: "Third two finger right ring finger.",
    isPlain: true,
    isRoll: false,
    fingersCodes: [4],
    hand: "right"
};
ImpressionInfo[FingerprintCaptureApi.Impression.THIRD_TWO_FINGER_RIGHT_LITTLE_FINGER] = {
    name: "Third two finger right little finger.",
    isPlain: true,
    isRoll: false,
    fingersCodes: [5],
    hand: "right"
};
ImpressionInfo[FingerprintCaptureApi.Impression.THIRD_TWO_FINGER_LEFT_RING_FINGER] = {
    name: "Third two finger left ring finger.",
    isPlain: true,
    isRoll: false,
    fingersCodes: [9],
    hand: "left"
};
ImpressionInfo[FingerprintCaptureApi.Impression.THIRD_TWO_FINGER_LEFT_LITTLE_FINGER] = {
    name: "Third two finger left little finger.",
    isPlain: true,
    isRoll: false,
    fingersCodes: [10],
    hand: "left"
};
ImpressionInfo[FingerprintCaptureApi.Impression.DUAL_INDEX_RIGHT_INDEX] = {
    name: "Dual index right index.",
    isPlain: true,
    isRoll: false,
    fingersCodes: [2],
    hand: "right"
};
ImpressionInfo[FingerprintCaptureApi.Impression.DUAL_INDEX_LEFT_INDEX] = {
    name: "Dual index left index.",
    isPlain: true,
    isRoll: false,
    fingersCodes: [7],
    hand: "left"
};


ImpressionInfo.MultiImpressions = [13, 14, 31];
ImpressionInfo.SingleFingerImpressions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * Translates from from a single finger impress, 1-10, to the code used to segment
 * that position out of a multi-impression image (e.g. slap or dual thumb)
 */
ImpressionInfo.SingleFingerToFingerInSlap = {
    1: 32, 2: 15, 3: 16, 4: 17, 5: 18,
    6: 33, 7: 19, 8: 20, 9: 21, 10: 22
};

/**
 * Returns a list of multi-impression codes that contain the roll or single plain impression
 * @param impression A single impression code
 * @returns {number[]}
 * @constructor
 */
ImpressionInfo.GetContainingImpressions = function (impression) {
    var impressions = [];

    if (ImpressionInfo.SingleFingerImpressions.indexOf(impression) === -1)
        throw new Error("impression argument must be contain a single finger code");

    for (var i = 0; i < ImpressionInfo.MultiImpressions.length; i++) {
        var multiImpression = ImpressionInfo.MultiImpressions[i];
        var multiImpressionInfo = ImpressionInfo[multiImpression];
        var contained = multiImpressionInfo.fingersCodes.indexOf(impression) > -1 ||
            multiImpressionInfo.plainCodes.indexOf(impression) > -1 ||
            multiImpressionInfo.slapCodes.indexOf(impression) > -1;
        if (contained)
            impressions.push(multiImpression)
    }
    return impressions;
};

/**
 * Returns a list of plain codes for a given roll code
 * @param impression A roll impression code
 * @returns {number[]}
 * @constructor
 */
ImpressionInfo.GetPlainCodes = function (impression) {
    var impressions = [];

    if (ImpressionInfo[impression].isPlain)
        throw new Error("Impression argument must be a roll");

    for (var i = 0; i < ImpressionInfo.MultiImpressions.length; i++) {
        var multiImpression = ImpressionInfo.MultiImpressions[i];
        var multiImpressionInfo = ImpressionInfo[multiImpression];
        var index = multiImpressionInfo.fingersCodes.indexOf(impression);
        if (index !== -1) {
            impressions.push(multiImpressionInfo.slapCodes[index]);
            impressions.push(multiImpressionInfo.plainCodes[index]);
        }
    }
    return impressions;
};

/**
 * Returns a list of finger codes that are contained in the impression. For multifinger impression,
 * the codes return are are the slap codes.
 * @param impression Impression to retrieve the contain impression codes.
 * @returns {number[]}
 * @constructor
 */
ImpressionInfo.GetContainedFingerCodes = function (impression) {
    var impressions = [];
    var impressionInfo = ImpressionInfo[impression];
    if (impressionInfo.hasOwnProperty("slapCodes")) {
        impressions = impressionInfo.slapCodes;
    }
    else {
        impressions.push(impression)
    }
    return impressions;
};

/**
 * Return true if the impression is a roll impression code
 * @param impression
 * @returns {boolean}
 */
ImpressionInfo.isRoll = function (impression) {
    return impression >= 1 && impression <= 10;
};


/**
 * DigitInfo differs from ImpressionInfo in that the code only identify a single finger or thumb. Also, it does not
 * include any addition information like plain/rolled.
 */
var SingleImpressionInfo = {};

SingleImpressionInfo[1] = {
    name: "Right Thumb",
    hand: "right"
};

SingleImpressionInfo[2] = {
    name: "Right Index",
    hand: "right"
};

SingleImpressionInfo[3] = {
    name: "Right Middle",
    hand: "right"
};

SingleImpressionInfo[4] = {
    name: "Right Ring",
    hand: "right"
};

SingleImpressionInfo[5] = {
    name: "Right Little",
    hand: "right"
};

SingleImpressionInfo[6] = {
    name: "Left Thumb",
    hand: "left"
};

SingleImpressionInfo[7] = {
    name: "Left Index",
    hand: "left"
};

SingleImpressionInfo[8] = {
    name: "Left middle",
    hand: "left"
};

SingleImpressionInfo[9] = {
    name: "Left Ring",
    hand: "left"
};

SingleImpressionInfo[10] = {
    name: "Left Little",
    hand: "left"
};
