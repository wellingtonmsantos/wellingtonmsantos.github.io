const fs = require("fs");
const path = require("path");

const defaultSections = {
  hero: true,
  sobre: true,
  modalidades: true,
  casos: true,
  projetos: true,
  videos: true,
  artigos: true,
  contato: true
};

const loadSectionConfig = () => {
  const configPath = path.join(__dirname, "..", "sections.config.json");

  try {
    const contents = fs.readFileSync(configPath, "utf8");
    const parsed = JSON.parse(contents);

    if (parsed && typeof parsed === "object") {
      if (parsed.sections && typeof parsed.sections === "object") {
        return { ...defaultSections, ...parsed.sections };
      }
      return { ...defaultSections, ...parsed };
    }
  } catch (error) {
    // Se o arquivo não existir ou tiver erro de parse, usamos os defaults.
  }

  return defaultSections;
};

module.exports = {
  title: "Wellington Santos",
  description: "Portfólio de Wellington ",
  url: "https://wellingtonsantos.com",
  author: {
    name: "Wellington Santos",
    email: "well.martins.santos@gmail.com"
  },
  social: {
    linkedin: "https://linkedin.com/in/wellingtonsantos",
    twitter: "https://twitter.com/wellingtonsantos",
    instagram: "https://instagram.com/wellingtonsantos",
    youtube: "https://youtube.com/@wellingtonsantos"
  },
  sections: loadSectionConfig(),
  buildTime: "now"
};
