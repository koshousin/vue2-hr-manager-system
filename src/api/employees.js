import request from '@/utils/request'

export function getEmployeeList(params) {
  return request({
    methods: 'get',
    url: '/sys/user',
    params
  })
}

export function getEmployeesSimple() {
  return request({
    url: "/sys/user/simple",
  });
}

export function getEmployeeDetail(id) {
  return request({
    url:'/sys/user/'+id
  })
}

export function delEmployee(id) {
  return request({
    method: "delete",
    url: `/sys/user/${id}`,
  });
}

export function addEmployee(data) {
  return request({
    method: "post",
    url: "/sys/user",
    data,
  });
}

export function importEmployee(data) {
  return request({
    url: "/sys/user/batch",
    method: "post",
    data,
  });
}

export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: "put", // 全量修改
    data,
  });
}

export function assignRoles(data) {
  return request({
    url: "/sys/user/assignRoles",
    data,
    method: "put",
  });
}