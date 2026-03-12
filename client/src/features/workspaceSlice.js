import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//import { dummyWorkspaces } from "../assets/assets";
import api from "../configs/api";

export const fetchWorkspaces = createAsyncThunk(
  'workspace/fetchWorkspaces',
  async ({ getToken }) => {
    try {
      const { data } = await api.get('/api/workspaces', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      return data || []
    } catch (error) {
      console.log(error?.response?.data?.message || error.message);
      return [];
    }
  },
);



const initialState = {
  workspaces: [],
  currentWorkspace: null,
  loading: false,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspaces: (state, action) => {
      state.workspaces = action.payload;
    },
    setCurrentWorkspace: (state, action) => {
      localStorage.setItem("currentWorkspaceId", action.payload);
      state.currentWorkspace = state.workspaces.find(
        (w) => w.id === action.payload,
      );
    },
    addWorkspace: (state, action) => {
      state.workspaces.push(action.payload);

      // set current workspace to the new workspace
      if (state.currentWorkspace?.id !== action.payload.id) {
        state.currentWorkspace = action.payload;
      }
    },
    updateWorkspace: (state, action) => {
      state.workspaces = state.workspaces.map((w) =>
        w.id === action.payload.id ? action.payload : w,
      );

      // if current workspace is updated, set it to the updated workspace
      if (state.currentWorkspace?.id === action.payload.id) {
        state.currentWorkspace = action.payload;
      }
    },
    deleteWorkspace: (state, action) => {
      state.workspaces = state.workspaces.filter(
        (w) => w.id !== action.payload
      );
    },
    addProject: (state, action) => {
      state.currentWorkspace.projects.push(action.payload);
    },
    addTask: (state, action) => {
      state.currentWorkspace.projects.forEach((p) => {
        if (p.id === action.payload.projectId) {
          p.tasks.push(action.payload);
        }
      });
    },
    updateTask: (state, action) => {
      state.currentWorkspace.projects.forEach((p) => {
        if (p.id === action.payload.projectId) {
          p.tasks = p.tasks.map((t) =>
            t.id === action.payload.id ? action.payload : t
          );
        }
      });
    },
    deleteTask: (state, action) => {
      const taskIds = action.payload;
      state.currentWorkspace.projects.forEach((p) => {
        p.tasks = p.tasks.filter((t) => !taskIds.includes(t.id));
      });
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWorkspaces.pending, (state) => {
      state.loading = true
    });
    builder.addCase(fetchWorkspaces.fulfilled, (state, action) => {
      state.workspaces = action.payload;
      if (action.payload.length > 0) {
        const localStorageCurrentWorkspaceId =
          localStorage.getItem('currentWorkspaceId');
        if (localStorageCurrentWorkspaceId) {
          const findWorkspace = action.payload.find((w) => w.id === localStorageCurrentWorkspaceId
          );

          if (findWorkspace) {
            state.currentWorkspace = findWorkspace;
          } else {
            state.currentWorkspace = action.payload[0];
          }
        } else {
          state.currentWorkspace = action.payload[0];
        }
      }
      state.loading = false;
    });
    builder.addCase(fetchWorkspaces.rejected, (state) => {
      state.loading = false;
    });
  }
});

export const {
  setWorkspaces,
  setCurrentWorkspace,
  addWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addProject,
  addTask,
  updateTask,
  deleteTask,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
