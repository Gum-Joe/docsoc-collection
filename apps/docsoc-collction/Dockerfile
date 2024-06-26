FROM node:lts

# Copy contents
COPY . /docsoc
WORKDIR /docsoc

# Make a user
RUN useradd -ms /bin/bash docsoc

# CHMOD
RUN chown -R docsoc /docsoc

# Switch to the user
USER docsoc

# Install dependencies
RUN npm ci

# Expose
EXPOSE 4200

# ENV
ENV HOST="0.0.0.0"
ENV PORT=4200

# Start the app
CMD ["npx", "nx", "serve-static", "docsoc-collction"]