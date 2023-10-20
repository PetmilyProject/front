export const AuthRoutes = {
  FIRST: 'First',
  SIGN_IN: 'SignIn',
  SIGN_UP: 'SignUp',
  NAVIGATION: 'Navigation',
  HOME: 'Home',
  ENTIRE: 'ENTIRE',
  UserInfo: 'UserInfo',
};

export const ContentRoutes = {
  HOME: '홈 화면',
  LIST: '리스트',
  REGISTER: '펫 등록',
  INFO: '정보',
  MAP: 'MAP',
  PROFILE: 'PROFILE',
};
//펫계정 등록 routes
export const AddPetRoutes = {
  EMPTY: 'EmptyPetProfileScreen',
  LIST: 'PetProfileListScreen',
  REGISTER: 'PetRegisterScreen',
};
export const CarePetRoutes = {
  MAIN_CARE_PET: 'MainCarePetScreen',
  // 스케줄
  EMPTY_SCHDULE: 'EmptySchduleScreen',
  ADD_SCHDULE: 'AddScheduleScreen',
  LIST_SCHEDULE: 'ScheduleListScreen',
  // 사진첩
  EMPTY_PHOTO: 'EmptyPhotoScreen',
  ADD_PHOTO: 'AddPhotoScreen',
  LIST_PHOTO: 'ListPhotoScreen',
  VIEW_PHOTO: 'ViewPhotoScreen',
  DETAIL_PHOTO: 'DetailPhotoScreen',
  // 양육자
  DETAIL_REARER: 'DetailRearerScreen',
  LIST_REARER: 'ListRearerScreen',
  // 펫정보
  VIEW_PET: 'ViewPetInfoScreen',
  VIEW_ScheduleModification: 'ScheduleModificationScreen',
};

export const CommunityRoutes = {
  ADD_COMMUNITY: 'AddCommunityScreen',
  UPDATE_COMMUNITY: 'CommunityUpdateScreen',
  PHOTO_COMMUNITY: 'CommunityPhotoScreen',
  DETAIL_COMMUNITY: 'CommunityDetailPhotoScreen',
};

export const UserInfoRoutes = {
  MAIN_USER: 'UserInfoScreen',
  WITHDRAWAL: 'UserWithdrawalScreen',
  USER_EDIT: 'UserInfoEditScreen',
};
