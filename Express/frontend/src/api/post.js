import http from "./index";

function validRequired(...args) {
  for (const key in args[0]) {
    if (!args[0][key]) {
      throw new Error(`${key} is Required.`);
    }
  }
}

const postApi = {
  async getById(id) {
    return await http.get(`post/${id}`);
  },
  async getAll() {
    return await http.get('post');
  },
  async create({ title, content }) {
    validRequired({ title, content });
    return await http.post('post', { title, content });
  },
  async update({ id, title, content }) {
    validRequired({ id });
    return await http.put('post', { id, title, content });
  },
  async delete(id) {
    validRequired({ id });
    return await http.delete(`post?id=${id}`);
  }
};

export default postApi;