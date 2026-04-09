FROM node:22-bookworm

# Install system dependencies + Neovim
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    ripgrep \
    fd-find \
    fzf \
    build-essential \
    python3 \
    python3-pip \
    && curl -LO https://github.com/neovim/neovim/releases/latest/download/nvim-linux-x86_64.tar.gz \
    && tar -C /usr/local -xzf nvim-linux-x86_64.tar.gz \
    && ln -sf /usr/local/nvim-linux-x86_64/bin/nvim /usr/local/bin/nvim \
    && rm nvim-linux-x86_64.tar.gz \
    && rm -rf /var/lib/apt/lists/* \
    && LAZYGIT_VERSION=$(curl -s "https://api.github.com/repos/jesseduffield/lazygit/releases/latest" | grep -Po '"tag_name": "v\K[^"]*') \
    && curl -Lo lazygit.tar.gz "https://github.com/jesseduffield/lazygit/releases/latest/download/lazygit_${LAZYGIT_VERSION}_Linux_x86_64.tar.gz" \
    && tar xf lazygit.tar.gz lazygit \
    && install lazygit /usr/local/bin \
    && rm lazygit lazygit.tar.gz

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]
