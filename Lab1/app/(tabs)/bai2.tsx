import React, { memo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';

interface EventProps {
  title: string;
  content: string;
  isImage?: boolean;
}

interface SectionListProps {
  title: string;
  events?: EventProps[];
  description?: string;
}

interface Bai2Props {
  eventInfo?: SectionListProps[];
  onPressDetails?: (section: SectionListProps) => void;
  titleStyle?: object;
  contentStyle?: object;
}

const defaultData = [
  {
    title: 'Lịch trình',
    description: 'Chuyến du lịch Hồ Tràm Vũng Tàu',
    events: [
      { title: 'Địa điểm', content: 'Hồ tràm, Vũng Tàu' },
      { title: 'Thời gian', content: '09:00 AM - 12:00 AM, 12/12/2024' },
      { title: 'Phương tiện di chuyển', content: 'Xe bus' },
      { title: 'Thời gian', content: '21:00 - 22:00' },
      {
        title: 'Hình ảnh',
        content:
          'https://media.istockphoto.com/id/1360554439/vi/anh/%C4%91%E1%BA%A3o-nhi%E1%BB%87t-%C4%91%E1%BB%9Bi-maldives.jpg?s=612x612&w=0&k=20&c=pqWxvBFhn0_mJQF-oNyiDS56iahHule2vZmmVbjc_TA=',
        isImage: true,
      },
    ],
  },
  {
    title: 'Khách sạn',
    description: 'Thông tin khách sạn',
    events: [
      { title: 'Tên khách sạn', content: 'Hồng Quỳnh' },
      { title: 'Giờ mở cửa', content: '06:00 AM - 12:00 AM' },
      { title: 'Địa điểm', content: '234 Quang Trung, Hồ Chí Minh' },
    ],
  },
];

const EventItem = memo(
  ({
    event,
    titleStyle,
    contentStyle,
  }: {
    event: EventProps;
    titleStyle?: object;
    contentStyle?: object;
  }) => {
    const { title, content, isImage } = event;

    const isImageUrl =
      isImage ||
      (content &&
        (content.startsWith('http://') || content.startsWith('https://')));

    return (
      <View style={styles.containerChild}>
        <Text style={[styles.titleChild, titleStyle]}>{title}</Text>
        {isImageUrl ? (
          <Image
            source={{ uri: content }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Text style={[styles.contentChild, contentStyle]}>{content}</Text>
        )}
      </View>
    );
  }
);

const Bai2: React.FC<Bai2Props> = ({
  eventInfo = defaultData,
  onPressDetails,
  titleStyle,
  contentStyle,
}) => {
  const handlePressDetails = useCallback(
    (section: SectionListProps) => {
      if (onPressDetails) {
        onPressDetails(section);
      } else {
        console.log('Xem chi tiết:', section.title);
      }
    },
    [onPressDetails]
  );

  const renderEvent = useCallback(
    (event: EventProps, index: number) => {
      return (
        <EventItem
          key={`event-${index}`}
          event={event}
          titleStyle={titleStyle}
          contentStyle={contentStyle}
        />
      );
    },
    [titleStyle, contentStyle]
  );

  const renderSection = useCallback(
    (section: SectionListProps, index: number) => {
      const { title, events = [], description } = section;

      return (
        <View key={`section-${index}`} style={styles.section}>
          <Text style={[styles.titleSection, titleStyle]}>{title}</Text>

          {description && (
            <Text style={styles.sectionDescription}>{description}</Text>
          )}

          <View style={[styles.sectionBody, styles.shadow]}>
            {events.map(renderEvent)}

            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => handlePressDetails(section)}
            >
              <Text style={styles.detailsButtonText}>Chi tiết</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [titleStyle, contentStyle, handlePressDetails, renderEvent]
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {eventInfo.map(renderSection)}
    </ScrollView>
  );
};

export default memo(Bai2);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    marginTop: 22,
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  titleSection: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  detailsButton: {
    width: '100%',
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionBody: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
  },
  containerChild: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  titleChild: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#444',
  },
  contentChild: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});
