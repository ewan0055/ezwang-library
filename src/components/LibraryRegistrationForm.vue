<template>
  <div class="container mt-5">
    <div class="row">
      <!-- 调整外层容器断点，适应 sm 屏幕 -->
      <div class="col-sm-10 offset-sm-1 col-md-8 offset-md-2">
        <h1 class="text-center">User Information Form / Credentials</h1>
        
        <form @submit.prevent="submitForm">
          <!-- Username & Password: 使用 col-sm-6 让 576px 以上的设备均保持两列 -->
          <div class="row mb-3">
            <div class="col-sm-6">
              <label for="username" class="form-label">Username:</label>
              <input 
                type="text" 
                class="form-control" 
                id="username" 
                v-model="formData.username"
              />
            </div>
            <div class="col-sm-6">
              <label for="password" class="form-label">Password:</label>
              <input 
                type="password" 
                class="form-control" 
                id="password" 
                v-model="formData.password"
              />
            </div>
          </div>

          <!-- Australian Resident & Gender: 使用 col-sm-6 保持两列并排 -->
          <div class="row mb-3">
            <div class="col-sm-6">
              <div class="form-check">
                <input 
                  type="checkbox" 
                  class="form-check-input" 
                  id="isAustralian" 
                  v-model="formData.isAustralian"
                />
                <label class="form-check-label" for="isAustralian">
                  Australian Resident?
                </label>
              </div>
            </div>
            <div class="col-sm-6">
              <label for="gender" class="form-label">Gender:</label>
              <select class="form-select" id="gender" v-model="formData.gender">
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <!-- Reason For Joining -->
          <div class="mb-3">
            <label for="reason" class="form-label">Reason For Joining:</label>
            <textarea 
              class="form-control" 
              id="reason" 
              rows="3" 
              v-model="formData.reason"
            ></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
        </form>

        <!-- 卡片展示区域 -->
        <div class="row mt-5" v-if="submittedCards.length">
          <div class="d-flex flex-wrap justify-content-start">
            <div v-for="(card, index) in submittedCards" :key="index" class="card m-2" style="width: 18rem;">
              <div class="card-header">
                User Information
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">Username: {{ card.username }}</li>
                <li class="list-group-item">Password: {{ card.password }}</li>
                <li class="list-group-item">Australian Resident: {{ card.isAustralian ? 'Yes' : 'No' }}</li>
                <li class="list-group-item">Gender: {{ card.gender }}</li>
                <li class="list-group-item">Reason: {{ card.reason }}</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

// 1. 表单响应式数据
const formData = ref({
  username: '',
  password: '',
  isAustralian: false,
  reason: '',
  gender: ''
})

// 2. 已提交的卡片列表
const submittedCards = ref([])

// 3. 提交表单方法
const submitForm = () => {
  submittedCards.value.push({
    ...formData.value
  })
}

// 4. 清空表单方法
const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    isAustralian: false,
    reason: '',
    gender: ''
  }
}
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