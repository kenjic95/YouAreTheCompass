import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";

export const Container = styled(SafeAreaView).attrs({
  edges: ["left", "right", "bottom"],
})`
  flex: 1;
  background-color: #6da8d6;
`;

export const ScrollContainer = styled.ScrollView`
  flex: 1;
`;

export const HeaderArea = styled.View`
  height: 150px;
  background-color: #f5f5f5;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 20px;
`;

export const HeaderTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #000;
`;

export const ProfileSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  column-gap: 12px;
  padding: 24px 20px 12px 20px;
`;

export const ProfileLeft = styled.View`
  flex: 1;
  min-width: 0px;
  flex-direction: row;
  align-items: center;
`;

export const AvatarCircle = styled.View`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  background-color: #d9d9d9;
  justify-content: center;
  align-items: center;
  margin-right: 14px;
`;

export const UserInfo = styled.View`
  flex: 1;
  min-width: 0px;
`;

export const UserName = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #fff;
`;

export const UserEmail = styled.Text`
  font-size: 14px;
  color: #fff;
  margin-top: 4px;
`;

export const PremiumButton = styled.TouchableOpacity`
  background-color: #3f79a8;
  padding-vertical: 10px;
  padding-horizontal: 14px;
  border-radius: 22px;
  max-width: 120px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
`;

export const PremiumButtonText = styled.Text`
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
`;

export const PremiumBadge = styled.View`
  background-color: #3f79a8;
  padding-vertical: 10px;
  padding-horizontal: 14px;
  border-radius: 22px;
  max-width: 150px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

export const PremiumBadgeText = styled.Text`
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  margin-left: 6px;
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #000;
  margin: 22px 20px 10px 20px;
`;

export const MenuCard = styled.TouchableOpacity`
  background-color: #dfeaf2;
  margin: 10px 20px;
  border-radius: 24px;
  min-height: 50px;
  padding-horizontal: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 5px;
  shadow-offset: 0px 4px;
  elevation: 5;
`;

export const MenuLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const MenuText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #111;
  margin-left: 16px;
`;

export const LogoutText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: #111;
  margin-left: 16px;
`;

export const BottomSpace = styled.View`
  height: 30px;
`;
