import { createSlice } from '@reduxjs/toolkit';

// Create images slice
const imagesSlice = createSlice({
    name: 'images',
    initialState: {
        selectedImages: []
    },
    reducers: {
        addImage: (state, action) => {
            state.selectedImages.push(action.payload);
        },
        removeImage: (state, action) => {
            state.selectedImages = state.selectedImages.filter(
                (_, index) => index !== action.payload
            );
        },
        clearImages: (state) => {
            state.selectedImages = [];
        }
    }
});

// Export actions
export const { addImage, removeImage, clearImages } = imagesSlice.actions;
export default imagesSlice;