const PREFIX = "???";

const req = (url, options = {}) => {
  const { body } = options;

  return fetch((PREFIX + url).replace(/\/\/$/, ""), {
    ...options,
    body: body ? JSON.stringify(body) : null,
    headers: {
      ...options.headers,
      ...(body
        ? {
            "Content-Type": "application/json",
          }
        : null),
    },
  }).then((res) =>
    res.ok
      ? res.json()
      : res.text().then((message) => {
          throw new Error(message);
        })
  );
};

export const getNotes = async ({ age, search, page } = {}) => {
  try {
    const response = await fetch(`/api/notes?age=${age}&search=${search}&page=${page}`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`error: ${error.message}`);
  }
};


export const createNote = async (title, text) => {
  try {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, text }),
    });

    if (!response.ok) {
      throw new Error(`error: ${response.statusText}`);
    }

    const note = await response.json();
    return note;
  } catch (error) {
    throw new Error(`error: ${error.message}`);
  }
};


export const getNote = async (id) => {
  try {
    const response = await fetch(`/api/notes/id?id=${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`error: ${error.message}`);
  }
};

export const archiveNote = async (id) => {
  try {
    const response = await fetch("/api/notes/archive", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error(`error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`error: ${error.message}`);
  }
};

export const unarchiveNote = async (id) => {
  try {
    const response = await fetch("/api/notes/archive", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error(`error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`error: ${error.message}`);
  }
};

export const editNote = async (id, title, text) => {
  try {
    const response = await fetch(`/api/notes/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, text }),
    });

    if (!response.ok) {
      throw new Error(`error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`error: ${error.message}`);
  }
};


export const deleteNote = async (id) => {
  try {
    const response = await fetch(`/api/notes/delete/id?id=${id}`, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`error: ${response.statusText}`);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    throw new Error(`error: ${error.message}`);
  }
};


export const deleteAllArchived = async () => {
  try {
    const response = await fetch("/api/notes/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ all: "allArchived" }),
    });

    if (!response.ok) {
      throw new Error(`error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`error: ${error.message}`);
  }
};

export const notePdfUrl = async (id) => {
  return `/api/notes/topdf?id=${id}`;
};
