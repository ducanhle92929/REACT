interface Images {
    error: any;
    clear: any;
    eyeOpen: any;
    eyeClosed: any;
}

const images: Images = {
    error: require('../assets/images/error.png'),
    clear: require('../assets/images/cancle.png'),
    eyeOpen: require('../assets/images/eye-on.png'),
    eyeClosed: require('../assets/images/eye-off.png'),
};

export default images;