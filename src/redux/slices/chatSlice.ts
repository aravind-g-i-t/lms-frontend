import { createSlice } from "@reduxjs/toolkit";

type ChatState = {
  unreadCount: number;
};

const initialState: ChatState = {
  unreadCount: 0,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUnreadCount(state, action) {
      state.unreadCount = action.payload;
    },
    incrementUnread(state) {
      state.unreadCount += 1;
    },
    resetUnread(state) {
      state.unreadCount = 0;
    },
  },
});

export const { setUnreadCount, incrementUnread, resetUnread } = chatSlice.actions;
export default chatSlice.reducer;
