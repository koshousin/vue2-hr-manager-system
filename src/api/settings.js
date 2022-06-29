import request from '@/utils/request'

export function getRoles(params) {
  return request({
    url: "/sys/role",
    method: "get",
    params: params,
  });
}

export function getRoleById(id) {
  return request({
    url: "/sys/role/" + id,
    method: "get",
  });
}

export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: "delete",
  });
}

export function addRole(data) {
  return request({
    url: "/sys/role",
    method: "post",
    data,
  });
}

export function updateRole(data) {
  return request({
    url: "/sys/role/" + data.id,
    method: "put",
    data
  });
}