import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
// import { PieChart } from 'react-native-chart-kit';
import { GRAY, YELLOW } from '../../../colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StatisticsScreen = ({ petName, petId }) => {
  const [allRearer, setAllRearer] = useState([]);
  const [chartData, setChartData] = useState([]); // State to hold chart data

  const fetchPetLink = async () => {
    try {
      const email = await AsyncStorage.getItem('email');
      const responseRearer = await axios.get(
        `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/link/rearer/${petId}`
      );
      const responseSchedule = await axios.get(
        `http://ec2-43-200-8-47.ap-northeast-2.compute.amazonaws.com:8080/schedule/${email}/get-all/${petId}`
      );

      if (responseRearer.status === 200) {
        updateChartData(responseRearer.data); // Update chart data when allRearer changes
      } else {
        console.error('펫 링크를 가져오는 데 실패했습니다');
      }
    } catch (error) {
      console.error('펫 링크를 가져오는 중 오류 발생:', error);
    }
  };

  // Function to update chart data
  const updateChartData = (data) => {
    const chartData = data.map((rearer) => ({
      name: rearer.ownerName,
      population: rearer.population,
      color: YELLOW.DEFAULT, // 랜덤 색상 생성
      legendFontColor: 'black', // BLACK 텍스트
      legendFontSize: 15, // 글꼴 크기 15
    }));
    setChartData(chartData);
  };

  useEffect(() => {
    fetchPetLink();
  }, []);

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForLabels: {
      fontSize: 15,
    },
  };

  return (
    <View style={styles.container}>
      <Text>
        2023년 10월 20일~ 10월 28일 수행 현황{'\n'}양육자{'\n'}일정
      </Text>
      <Text>양육자</Text>
      <Text>일정</Text>
      <Text>양육자별 통계</Text>

      {/* <PieChart
        data={chartData} // Use updated chart data here
        width={Dimensions.get('window').width - 20}
        height={230}
        chartConfig={chartConfig}
        accessor={'population'}
        backgroundColor={'transparent'}
        center={[10, 50]}
        absolute
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: GRAY.LIGHTER,
  },
});

export default StatisticsScreen;
