import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Colors from "../../../constants/Colors";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

export default class Drawer extends Component {
  // Define prop types
  static propTypes = {
    // Pass messages to show as children
    children: PropTypes.any,
    // Whether the window is open or not
    isOpen: PropTypes.bool,
    // Header that shows up on top the screen when opened
    header: PropTypes.string,
    // Header height
    headerHeight: PropTypes.number,
    // Height of the visible teaser area at the bottom of the screen
    teaserHeight: PropTypes.number
  };

  // Set default prop values
  static defaultProps = {
    isOpen: false,
    header: "",
    headerHeight: 60,
    teaserHeight: 300
  };

  // Define state
  state = {
    // Whether it's open or not
    open: false,
    // Whether the window is being pulled up/down or not
    pulling: false,
    // Zero means user haven't scrolled the content yet
    scrollOffset: 0
  };

  // Configure animations
  config = {
    // Window position
    position: {
      // maximum possible value - the bottom edge of the screen
      max: height,
      // starting value - teaserHeight higher than the bottom of the screen
      start: height - this.props.teaserHeight,
      // end value - headerHeight lower than the top of the screen
      end: this.props.headerHeight,
      // minimal possible value - a bit lower the top of the screen
      min: this.props.headerHeight,
      // When animated triggers these value updates
      animates: [
        () => this._animatedOpacity,
        () => this._animatedWidth,
        () => this._animatedPadding
      ]
    },
    // Window width
    width: {
      end: width, // takes full with once opened
      start: width - 24 // slightly narrower than screen when closed
    },
    // Window backdrop opacity
    opacity: {
      start: 0, // fully transparent when closed
      end: 1 // not transparent once opened
    },
    top_padding: {
      start: 30,
      end: 80
    }
  };

  // Pan responder to handle gestures
  _panResponder = {};

  // Animates backdrop opacity
  _animatedOpacity = new Animated.Value(this.config.opacity.start);

  // Animates window width
  _animatedWidth = new Animated.Value(this.config.width.start);

  // Animates top padding
  _animatedPadding = new Animated.Value(this.config.top_padding.start);

  // Animates window position
  _animatedPosition = new Animated.Value(
    this.props.isOpen ? this.config.position.end : this.config.position.start
  );

  componentWillMount() {
    // Set current position
    this._currentPosition = this._animatedPosition._value;
    // Listen for this._animatedPosition changes
    this._animatedPosition.addListener(value => {
      // Update _currentPosition
      this._currentPosition = value.value;
      // Animate depending values
      this.config.position.animates.map(item => {
        item().setValue(value.value);
      });
    });
    // Reset value once listener is registered to update depending animations
    this._animatedPosition.setValue(this._animatedPosition._value);
    // Initialize PanResponder to handle gestures
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._grantPanResponder,
      onStartShouldSetPanResponderCapture: this._grantPanResponder,
      onMoveShouldSetPanResponder: this._grantPanResponder,
      onMoveShouldSetPanResponderCapture: this._grantPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
      onShouldBlockNativeResponder: (evt, gestureState) => true
    });
  }

  // Handle isOpen prop changes to either open or close the window
  componentWillReceiveProps(nextProps) {
    // isOpen prop changed to true from false
    if (!this.props.isOpen && nextProps.isOpen) {
      this.open();
    }
    // isOpen prop changed to false from true
    else if (this.props.isOpen && !nextProps.isOpen) {
      this.close();
    }
  }

  render() {
    const { children, header } = this.props,
      // Interpolate position value into opacity value
      animatedOpacity = this._animatedOpacity.interpolate({
        inputRange: [this.config.position.end, this.config.position.start],
        outputRange: [this.config.opacity.end, this.config.opacity.start]
      }),
      animatedPadding = this._animatedPadding.interpolate({
        inputRange: [this.config.position.end, this.config.position.start],
        outputRange: [
          this.config.top_padding.end,
          this.config.top_padding.start
        ]
      }),
      // Interpolate position value into width value
      animatedWidth = this._animatedWidth.interpolate({
        inputRange: [
          this.config.position.min, // top of the screen
          this.config.position.start - 50, // 50 pixels higher than next point
          this.config.position.start, // a bit higher than the bottom of the screen
          this.config.position.max // the bottom of the screen
        ],
        outputRange: [
          this.config.width.end, // keep max width after next point
          this.config.width.end, // end: max width at 50 pixel higher
          this.config.width.start, // start: min width at the bottom
          this.config.width.start // keep min width before previous point
        ]
      });
    return (
      <Animated.View style={[styles.container]}>
        {/* Backdrop with animated opacity */}
        <Animated.View style={[styles.backdrop, { opacity: animatedOpacity }]}>
          {/* Close window when tapped on header */}
          <TouchableWithoutFeedback onPress={this.close}>
            <View style={[styles.header, this.getHeaderStyle()]}></View>
          </TouchableWithoutFeedback>
        </Animated.View>
        {/* Content container */}
        <Animated.View
          style={[
            styles.content,
            this.props.color,
            this.getContentStyle(),
            {
              // Add padding at the bottom to fit all content on the screen
              paddingBottom: 150,
              // Animate width
              width: animatedWidth,
              paddingTop: animatedPadding,
              // Animate position on the screen
              transform: [
                { translateY: this._animatedPosition },
                { translateX: 0 }
              ]
            }
          ]}
          // Handle gestures
          {...this._panResponder.panHandlers}
        >
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 0,
              left: 0,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={[
                { height: 6, width: 45, borderRadius: 10 },
                this.state.pulling
                  ? { backgroundColor: "white" }
                  : { backgroundColor: "rgba(0,0,0,0.2)" }
              ]}
            ></View>
          </View>
          {/* Put all content in a scrollable container */}
          <ScrollView
            ref={scrollView => {
              this._scrollView = scrollView;
            }}
            // Enable scrolling only when the window is open
            scrollEnabled={this.state.open}
            // Hide all scrolling indicators
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            // Trigger onScroll often
            scrollEventThrottle={16}
            onScroll={this._handleScroll}
          >
            {/* Render children components */}
            {children}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    );
  }

  // Either allow or deny gesture handler
  _grantPanResponder = (evt, gestureState) => {
    // Allow if is not open
    if (!this.state.open) {
      return true;
    }
    // Allow if user haven't scroll the content yet
    else if (this.pulledDown(gestureState) && this.state.scrollOffset <= 0) {
      return true;
    }
    // Allow if pulled down rapidly
    else if (this.pulledDown(gestureState) && this.pulledFast(gestureState)) {
      return true;
    }
    // Deny otherwise
    return false;
  };

  // Called when granted
  _handlePanResponderGrant = (evt, gestureState) => {
    // Update the state so we know we're in the middle of pulling it
    this.setState({ pulling: true });
    // Set offset and initialize with 0 so we update it
    // with relative values from gesture handler
    this._animatedPosition.setOffset(this._currentPosition);
    this._animatedPosition.setValue(0);
  };

  // Called when being pulled
  _handlePanResponderMove = (evt, gestureState) => {
    // Update position unless we go outside of allowed range
    if (this.insideAllowedRange()) {
      this._animatedPosition.setValue(gestureState.dy);
    }
  };

  // Called when gesture ended
  _handlePanResponderEnd = (evt, gestureState) => {
    // Reset offset
    this._animatedPosition.flattenOffset();
    // Reset pulling state
    this.setState({ pulling: false });
    // Pulled down and far enough to trigger close
    if (this.pulledDown(gestureState) && this.pulledFar(gestureState)) {
      return this.close();
    }
    // Pulled up and far enough to trigger open
    else if (this.pulledUp(gestureState) && this.pulledFar(gestureState)) {
      return this.open();
    }
    // Toggle if tapped
    else if (this.tapped(gestureState)) {
      return this.toggle();
    }
    // Restore back to appropriate position otherwise
    else {
      this.restore();
    }
  };

  // Handle content scrolling
  _handleScroll = event => {
    const { y } = event.nativeEvent.contentOffset;
    this.setState({ scrollOffset: y });
  };

  // Check if gesture was a tap
  tapped = gestureState => gestureState.dx === 0 && gestureState.dy === 0;

  // Check if pulled up
  pulledUp = gestureState => gestureState.dy < 0;

  // Check if pulled down
  pulledDown = gestureState => gestureState.dy > 0;

  // Check if pulled rapidly
  pulledFast = gestureState => Math.abs(gestureState.vy) > 0.75;

  // Check if pulled far
  pulledFar = gestureState => Math.abs(gestureState.dy) > 50;

  // Check if current position is inside allowed range
  insideAllowedRange = () =>
    this._currentPosition >= this.config.position.min &&
    this._currentPosition <= this.config.position.max;

  // Open up the window on full screen
  open = () => {
    this.setState({ open: true }, () => {
      Animated.timing(this._animatedPosition, {
        toValue: this.config.position.end,
        duration: 400
      }).start();
    });
  };

  // Minimize window and keep a teaser at the bottom
  close = () => {
    this._scrollView.scrollTo({ y: 0 });
    Animated.timing(this._animatedPosition, {
      toValue: this.config.position.start,
      duration: 400
    }).start(() =>
      this.setState({
        open: false
      })
    );
  };

  // Toggle window state between opened and closed
  toggle = () => {
    if (!this.state.open) {
      this.open();
    } else {
      this.close();
    }
  };

  // Either open or close depending on the state
  restore = () => {
    if (this.state.open) {
      this.open();
    } else {
      this.close();
    }
  };

  // Get header style
  getHeaderStyle = () => ({
    height:
      Platform.OS === "ios"
        ? this.props.headerHeight
        : this.props.headerHeight - 40 // compensate for the status bar
  });

  getContentStyle = () => ({
    paddingVertical: this.state.pulling || this.state.open ? 82 : 0
  });

  // Get container style
  getContainerStyle = () => ({
    // Move the view below others if not open or moving
    // to not block gesture handlers on other views
    zIndex: this.state.pulling || this.state.open ? 1 : -1
  });
}

const styles = StyleSheet.create({
  // Main container
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 25,
    alignItems: "center", // center children
    justifyContent: "flex-end", // align popup at the bottom
    backgroundColor: "transparent", // transparent background
    zIndex: 1,
    shadowColor: "#d6d6d6",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 10
  },
  // Semi-transparent background below popup
  backdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 25,
    alignItems: "center", // center children
    justifyContent: "flex-start", // align popup at the bottom
    backgroundColor: "rgba(0, 0, 0, 0.7)"
  },
  // Body
  content: {
    backgroundColor: Colors.YELLOW,
    height: height,
    borderRadius: 35
  },
  // Header
  header: {
    flexDirection: "row", // arrange children in a row
    alignItems: "center", // center vertically
    paddingTop: 20,
    paddingHorizontal: 20,
    alignSelf: "stretch"
  },
  headerIcon: {
    marginRight: 10
  },
  headerTitle: {
    flex: 1 // take up all available space
  },
  headerText: {
    color: "white",
    fontFamily: "Avenir",
    fontWeight: "600",
    fontSize: 16
  }
});
