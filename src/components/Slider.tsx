import { Dimensions, Image, View } from "react-native";
import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { Loading } from "./Loading";

const window = Dimensions.get("window");
const PAGE_WIDTH = window.width;
const windowWidth = Dimensions.get("window").width;

export function Slider({ images }: { images: { uri: string }[] }) {
  const progressValue = useSharedValue<number>(0);

  return (
    <>
      <Carousel
        width={PAGE_WIDTH}
        height={280}
        loop={false}
        pagingEnabled={true}
        onProgressChange={(_, absoluteProgress) =>
          (progressValue.value = absoluteProgress)
        }
        data={images}
        renderItem={({ item }) => (
          <Image
            style={{ width: PAGE_WIDTH, height: 280 }}
            source={{ uri: item.uri }}
          />
        )}
      />

      {!!progressValue && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: PAGE_WIDTH,
            paddingHorizontal: 10,
            marginTop: -15,
          }}
        >
          {images.map((_, index) => {
            return (
              <PaginationItem
                backgroundColor={"#9F9BA1"}
                animValue={progressValue}
                index={index}
                key={index}
                length={index}
                totalItems={images.length}
              />
            );
          })}
        </View>
      )}
    </>
  );
}

const PaginationItem: React.FC<{
  index: number;
  backgroundColor: string;
  length: number;
  animValue: SharedValue<number>;
  totalItems: number;
  isRotate?: boolean;
}> = (props) => {
  const { animValue, index, length, backgroundColor, totalItems } = props;
  const height = 3;
  const width = windowWidth / totalItems - 20;

  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [-height, 0, height];

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
      outputRange = [-height, 0, height];
    }

    return {
      transform: [
        {
          translateY: interpolate(
            animValue?.value,
            inputRange,
            outputRange,
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  }, [animValue, index, length]);

  return (
    <View
      style={{
        backgroundColor: "#EDECEE",
        width,
        height,
        borderRadius: 5,
        overflow: "hidden",
        marginVertical: 5,
      }}
    >
      <Animated.View
        style={[
          {
            backgroundColor,
            flex: 1,
          },
          animStyle,
        ]}
      />
    </View>
  );
};
