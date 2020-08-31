exports.env = {
  accessSecretKey: String,
  // access_token 암호화 키값

  mongoAddr: String,
  // mongoDB 주소

  rabumsAddr: String,
  // RABUMS 주소

  rabumsToken: String,
  // RABUMS 토큰
};

exports.answerPostAnswersBody = {
  questionId: Number,
  answerContent: String,
};

exports.answerPostScoringBody = {
  questionId: Number,
  score: Number,
};

exports.userInfo = {
  userId: String,
  userName: String,
  userNumber: Number,
};

exports.assignmentArray = [
  {
    meta: {
      createdAt: Date,
      modifiedAt: Date,
    },
    students: [Number],
    questions: [
      {
        questionContent: String,
        fullScore: Number,
      },
    ],
    assignmentId: Number,
    professorNumber: Number,
    assignmentName: String,
    assignmentInfo: String,
    publishingTime: Date,
    deadline: Date,
    assignmentState: Number,
  },
];

exports.vaultResponse = {
  data: {
    data: {
      accessSecretKey: String,
      mongoURI: String,
      rabumsAddr: String,
      rabumsToken: String,
      testMongo: String, // 테스트용
    },
  },
};

exports.jwtInfo = {
  userName: String,
  userNumber: Number,
  userId: String,
};
