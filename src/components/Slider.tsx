import { api } from "@/services/api";
import { Dimensions, Image, View } from "react-native";
import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { TextBold } from "./TextBold";

const windowWidth = Dimensions.get("window").width;

interface ImageItem {
  path?: string;
  uri?: string;
}

interface SliderProps {
  images: ImageItem[];
  is_active?: boolean;
}

export function Slider({ images, is_active = true }: SliderProps) {
  const progressValue = useSharedValue<number>(0);

  return (
    <>
      <Carousel
        width={windowWidth}
        height={280}
        loop={false}
        pagingEnabled={true}
        onProgressChange={(_, absoluteProgress) =>
          (progressValue.value = absoluteProgress)
        }
        data={images}
        renderItem={({ item }) => (
          <>
            {!is_active && (
              <View className="absolute z-20 w-full h-full items-center justify-center">
                <View className="bg-gray-1 absolute z-20 w-full h-full opacity-50" />
                <TextBold
                  text="Anúncio desativado"
                  className="text-gray-7 z-30"
                  type="LARGE"
                />
              </View>
            )}

            <Image
              style={{
                width: windowWidth,
                height: 280,
              }}
              source={{
                uri: item.uri
                  ? item.uri
                  : item.path
                  ? `${api.defaults.baseURL}/images/${item.path}`
                  : undefined,
              }}
            />
          </>
        )}
      />

      {!!progressValue && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: windowWidth,
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
