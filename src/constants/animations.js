const animations = {
  fadeInDown: {
    from: {
      opacity: 0,
      translateY: -40,
      translateX: -15,
      scale: 0.6
    },
    to: {
      opacity: 1,
      translateY: 0,
      translateX: 0,
      scale: 1
    },
    easing: 'ease-in'
  },
  moveLeft: {
    from: { translateX: 0 },
    to: { translateX: -10 }
  },
  shake: {
    0: {
      translateX: 0
    },
    0.2: {
      translateX: -10
    },
    0.4: {
      translateX: 10
    },
    0.6: {
      translateX: -10
    },
    0.8: {
      translateX: 10
    },
    1: {
      translateX: 0
    }
  }
}

export default animations
