<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">User Information Form</h1>
        <form @submit.prevent="submitForm">
          <!-- Username & Password Row -->
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="username" class="form-label">Username</label>
              <input 
                type="text" 
                class="form-control" 
                id="username" 
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
                v-model="formData.username" 
              />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>
            <div class="col-md-6 col-sm-6">
              <label for="password" class="form-label">Password</label>
              <input 
                type="password" 
                class="form-control" 
                id="password" 
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
                v-model="formData.password" 
              />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
          </div>

          <!-- Australian Resident & Gender Row -->
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <div class="form-check">
                <input 
                  type="checkbox" 
                  class="form-check-input" 
                  id="isAustralian" 
                  v-model="formData.isAustralian" 
                />
                <label class="form-check-label" for="isAustralian">Australian Resident?</label>
              </div>
            </div>
            <div class="col-md-6 col-sm-6">
              <label for="gender" class="form-label">Gender</label>
              <select 
                class="form-select" 
                id="gender" 
                v-model="formData.gender"
                @change="() => validateGender(true)"
                @blur="() => validateGender(true)"
              >
                <option value="" disabled>Please select a gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <div v-if="errors.gender" class="text-danger">{{ errors.gender }}</div>
            </div>
          </div>

          <!-- Reason for joining Row -->
          <div class="mb-3">
            <label for="reason" class="form-label">Reason for joining</label>
            <textarea 
              class="form-control" 
              id="reason" 
              rows="3" 
              v-model="formData.reason"
            ></textarea>
          </div>

          <!-- Buttons Row -->
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>

          <!-- PrimeVue DataTable -->
          <div class="mt-5" v-if="submittedCards.length > 0">
          <h2 class="text-center mb-3">Submitted Users</h2>
          <DataTable :value="submittedCards" tableStyle="min-width: 100%">
            <Column field="username" header="Username"></Column>
            <Column field="password" header="Password"></Column>
            <Column field="isAustralian" header="Australian Resident">
              <template #body="slotProps">
                {{ slotProps.data.isAustralian ? 'Yes' : 'No' }}
              </template>
            </Column>
            <Column field="gender" header="Gender"></Column>
            <Column field="reason" header="Reason for joining"></Column>
          </DataTable>
        </div>
        </form>
      </div>
    </div>
  </div>


</template>
<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
//
const formData = ref({
  username: '',
  password: '',
  isAustralian: false,
  reason: '',
  gender: ''
})

// 
const submittedCards = ref([])


// 
const submitForm = () => {
  validateName(true);
  validatePassword(true);
  validateGender(true);
  if (!errors.value.username && !errors.value.password) {
    submittedCards.value.push({ ...formData.value });
    clearForm();
  }
};

const validateGender = (blur) => {
  if (!formData.value.gender) {
    if (blur) errors.value.gender = "Please select a gender.";
  } else {
    errors.value.gender = null;
  }
};

// 
const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    isAustralian: false,
    reason: '',
    gender: ''
  }
}

const errors = ref({
  username: null,
  password: null,
  resident: null,
  gender: null,
  reason: null,
});

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = "Name must be at least 3 characters";
  } else {
    errors.value.username = null;
  }
};

const validatePassword = (blur) => {
  const password = formData.value.password;
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`;
  } else if (!hasUppercase) {
    if (blur) errors.value.password = "Password must contain at least one uppercase letter.";
  } else if (!hasLowercase) {
    if (blur) errors.value.password = "Password must contain at least one lowercase letter.";
  } else if (!hasNumber) {
    if (blur) errors.value.password = "Password must contain at least one number.";
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = "Password must contain at least one special character.";
  } else {
    errors.value.password = null;
  }
};
</script>


<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #275FDA;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

.list-group-item {
  padding: 10px;
}
</style>