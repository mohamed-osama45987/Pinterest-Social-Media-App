export const userQuery = (userId) => {
  const query = `*[_type == "user" && _id == '${userId}']`;

  return query;
};

export const searchQuery = (searchTerm) => {
  const query = `*[_type == "pin" && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*']{
    image{
      asset -> {
        url
      }
    },
    _id,
    destination,
    postedBy -> {
      _id,
      userName,
      image
    },

    save[] {
      _key,
      postedBy -> {
        _id,
        userName,
        image
      },
    },

  }`; // this will allow sanity to debounce user input form our front end

  return query;
};

export const feedQuery = `*[_type == "pin" ] | order(_createdAt desc) {

  image{
    asset->{
      url
    }
  },

  _id,
  destination,
  postedBy->{
    _id,
    userName,
    image
  },

  save[] {
    _key,
    postedBy->{
      _id,
      userName,
      image
    },
  },

}`;
