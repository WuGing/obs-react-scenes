"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_tsparticles_1 = require("react-tsparticles");
// import someTheme from '../theme.modules.scss';
require("./Background.scss");
var Background = /** @class */ (function (_super) {
    __extends(Background, _super);
    function Background() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Background.prototype.render = function () {
        var backgroundColor = "#fff";
        var particleColor = "#ff0000";
        return (React.createElement(React.Fragment, null,
            React.createElement(react_tsparticles_1.default, { id: "tsparticles", options: {
                    "autoPlay": true,
                    "background": {
                        "color": {
                            "value": backgroundColor
                        },
                        "image": "",
                        "position": "",
                        "repeat": "",
                        "size": "",
                        "opacity": 1
                    },
                    "backgroundMask": {
                        "composite": "destination-out",
                        "cover": {
                            "color": {
                                "value": "#fff"
                            },
                            "opacity": 1
                        },
                        "enable": false
                    },
                    "fullScreen": {
                        "enable": true,
                        "zIndex": -1
                    },
                    "detectRetina": true,
                    "fpsLimit": 60,
                    "infection": {
                        "cure": false,
                        "delay": 0,
                        "enable": false,
                        "infections": 0,
                        "stages": []
                    },
                    "interactivity": {
                        "detectsOn": "window",
                        "events": {
                            "onClick": {
                                "enable": false,
                                "mode": []
                            },
                            "onHover": {
                                "enable": true,
                                "mode": "trail",
                                "parallax": {
                                    "enable": false,
                                    "force": 2,
                                    "smooth": 10
                                }
                            },
                            "resize": true
                        },
                        "modes": {
                            "attract": {
                                "distance": 200,
                                "duration": 0.4,
                                "easing": react_tsparticles_1.EasingType.easeOutQuad,
                                "factor": 1,
                                "maxSpeed": 50,
                                "speed": 1
                            },
                            "bubble": {
                                "distance": 200,
                                "duration": 0.4
                            },
                            "connect": {
                                "distance": 80,
                                "links": {
                                    "opacity": 0.5
                                },
                                "radius": 60
                            },
                            "grab": {
                                "distance": 100,
                                "links": {
                                    "blink": false,
                                    "consent": false,
                                    "opacity": 1
                                }
                            },
                            "light": {
                                "area": {
                                    "gradient": {
                                        "start": {
                                            "value": "#ffffff"
                                        },
                                        "stop": {
                                            "value": "#000000"
                                        }
                                    },
                                    "radius": 1000
                                },
                                "shadow": {
                                    "color": {
                                        "value": "#000000"
                                    },
                                    "length": 2000
                                }
                            },
                            "push": {
                                "quantity": 4
                            },
                            "remove": {
                                "quantity": 2
                            },
                            "repulse": {
                                "distance": 200,
                                "duration": 0.4,
                                "factor": 100,
                                "speed": 1,
                                "maxSpeed": 50,
                                "easing": react_tsparticles_1.EasingType.easeOutQuad
                            },
                            "slow": {
                                "factor": 3,
                                "radius": 200
                            }
                        }
                    },
                    "manualParticles": [],
                    "motion": {
                        "disable": false,
                        "reduce": {
                            "factor": 2,
                            "value": true
                        }
                    },
                    "particles": {
                        "bounce": {
                            "horizontal": {
                                "random": {
                                    "enable": false,
                                    "minimumValue": 0.1
                                },
                                "value": 1
                            },
                            "vertical": {
                                "random": {
                                    "enable": false,
                                    "minimumValue": 0.1
                                },
                                "value": 1
                            }
                        },
                        "collisions": {
                            "bounce": {
                                "horizontal": {
                                    "random": {
                                        "enable": false,
                                        "minimumValue": 0.1
                                    },
                                    "value": 1
                                },
                                "vertical": {
                                    "random": {
                                        "enable": false,
                                        "minimumValue": 0.1
                                    },
                                    "value": 1
                                }
                            },
                            "enable": true,
                            "mode": "bounce",
                            "overlap": {
                                "enable": true,
                                "retries": 0
                            }
                        },
                        "color": {
                            "value": particleColor
                        },
                        "destroy": {
                            "mode": react_tsparticles_1.DestroyMode.none,
                            "split": {
                                "count": 1,
                                "factor": {
                                    "random": {
                                        "enable": false,
                                        "minimumValue": 0
                                    },
                                    "value": 3
                                },
                                "rate": {
                                    "random": {
                                        "enable": false,
                                        "minimumValue": 0
                                    },
                                    "value": {
                                        "min": 4,
                                        "max": 9
                                    }
                                },
                                "sizeOffset": true
                            }
                        },
                        "life": {
                            "count": 0,
                            "delay": {
                                "random": {
                                    "enable": false,
                                    "minimumValue": 0
                                },
                                "value": 0,
                                "sync": false
                            },
                            "duration": {
                                "random": {
                                    "enable": false,
                                    "minimumValue": 0.0001
                                },
                                "value": 0,
                                "sync": false
                            }
                        },
                        "links": {
                            "blink": false,
                            "color": {
                                "value": "random"
                            },
                            "consent": false,
                            "distance": 100,
                            "enable": true,
                            "frequency": 1,
                            "opacity": 1,
                            "shadow": {
                                "blur": 5,
                                "color": {
                                    "value": "#00ff00"
                                },
                                "enable": false
                            },
                            "triangles": {
                                "enable": false,
                                "frequency": 1
                            },
                            "width": 1,
                            "warp": false
                        },
                        "move": {
                            "angle": {
                                "offset": 0,
                                "value": 90
                            },
                            "attract": {
                                "distance": 200,
                                "enable": false,
                                "rotate": {
                                    "x": 3000,
                                    "y": 3000
                                }
                            },
                            "decay": 0,
                            "distance": 0,
                            "direction": "none",
                            "drift": 0,
                            "enable": true,
                            "gravity": {
                                "acceleration": 9.81,
                                "enable": false,
                                "inverse": false,
                                "maxSpeed": 50
                            },
                            "path": {
                                "clamp": true,
                                "delay": {
                                    "random": {
                                        "enable": false,
                                        "minimumValue": 0
                                    },
                                    "value": 0
                                },
                                "enable": false
                            },
                            "outModes": {
                                "default": "out",
                                "bottom": "out",
                                "left": "out",
                                "right": "out",
                                "top": "out"
                            },
                            "random": false,
                            "size": false,
                            "speed": 2,
                            "straight": false,
                            "trail": {
                                "enable": false,
                                "length": 10,
                                "fillColor": {
                                    "value": "#000000"
                                }
                            },
                            "vibrate": false,
                            "warp": false
                        },
                        "number": {
                            "density": {
                                "enable": true,
                                "area": 800,
                                "factor": 1000
                            },
                            "limit": 0,
                            "value": 100
                        },
                        "opacity": {
                            "random": {
                                "enable": true,
                                "minimumValue": 0.3
                            },
                            "value": {
                                "min": 0.3,
                                "max": 0.8
                            },
                            "animation": {
                                "count": 0,
                                "enable": true,
                                "speed": 0.5,
                                "sync": false,
                                "destroy": "none",
                                "minimumValue": 0.3,
                                "startValue": "random"
                            }
                        },
                        "reduceDuplicates": false,
                        "roll": {
                            "darken": {
                                "enable": false,
                                "value": 0
                            },
                            "enable": false,
                            "enlighten": {
                                "enable": false,
                                "value": 0
                            },
                            "speed": 25
                        },
                        "rotate": {
                            "random": {
                                "enable": false,
                                "minimumValue": 0
                            },
                            "value": 0,
                            "animation": {
                                "enable": false,
                                "speed": 0,
                                "sync": false
                            },
                            "direction": "clockwise",
                            "path": false
                        },
                        "shadow": {
                            "blur": 0,
                            "color": {
                                "value": "#000000"
                            },
                            "enable": false,
                            "offset": {
                                "x": 0,
                                "y": 0
                            }
                        },
                        "shape": {
                            "type": "circle"
                        },
                        "size": {
                            "random": {
                                "enable": true,
                                "minimumValue": 1
                            },
                            "value": {
                                "min": 1,
                                "max": 3
                            },
                            "animation": {
                                "count": 0,
                                "enable": true,
                                "speed": 3,
                                "sync": false,
                                "destroy": "none",
                                "minimumValue": 1,
                                "startValue": "random"
                            }
                        },
                        "stroke": {
                            "width": 0,
                            "color": {
                                "value": "",
                                "animation": {
                                    "h": {
                                        "count": 0,
                                        "enable": false,
                                        "offset": 0,
                                        "speed": 0,
                                        "sync": false
                                    },
                                    "s": {
                                        "count": 0,
                                        "enable": false,
                                        "offset": 0,
                                        "speed": 1,
                                        "sync": true
                                    },
                                    "l": {
                                        "count": 0,
                                        "enable": false,
                                        "offset": 0,
                                        "speed": 1,
                                        "sync": true
                                    }
                                }
                            }
                        },
                        "tilt": {
                            "random": {
                                "enable": false,
                                "minimumValue": 0
                            },
                            "value": 0,
                            "animation": {
                                "enable": false,
                                "speed": 0,
                                "sync": false
                            },
                            "direction": "clockwise",
                            "enable": false
                        },
                        "twinkle": {
                            "lines": {
                                "enable": false,
                                "frequency": 0.05,
                                "opacity": 1
                            },
                            "particles": {
                                "enable": false,
                                "frequency": 0.05,
                                "opacity": 1
                            }
                        },
                        "wobble": {
                            "distance": 5,
                            "enable": false,
                            "speed": 50
                        }
                    },
                    "pauseOnBlur": true,
                    "pauseOnOutsideViewport": true,
                    "responsive": [],
                    "themes": []
                } })));
    };
    return Background;
}(React.PureComponent));
exports.default = Background;
//# sourceMappingURL=Background.js.map