import request from '@/utils/request'

export function getDepartments() {
  return request({
    url: "/company/department",
  });
}

export function addDepartments(data) {
  return request({
    url: "/company/department",
    method: "post",
    data,
  });
}

export function getDepartmentsById(id) {
  return request({
    url: "/company/department/" + id
  });
}

export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: "put",
    data,
  });
}

export function deleteDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: "delete",
  });
}