# Resume System - Complete Workflow Guide

## 系统架构概览

### 数据层
```
.agent/skills/project_archivist/data/
├── user_profile.json       # 个人信息、工作时间线、联系方式
└── projects.json           # 技术项目详细信息
```

### 输出层
```
/home/Resume/
├── index.html              # Slide Deck Resume (Web)
├── resume_slides.pdf       # Slide Deck Resume (PDF)
├── resume_onepage.html     # One-Page Resume (Web)
└── resume_onepage.pdf      # One-Page Resume (PDF)
```

---

## 核心 Workflows

### 1️⃣ 添加新项目 (`/add_project`)

**使用场景**：第一次添加全新的技术项目

**完整流程**：
```bash
# Step 1: 更新 projects.json
# 添加项目到对应的 category

# Step 2: 生成架构文档
# .agent/skills/project_archivist/documents/[project_slug]/architecture.md

# Step 3: 生成面试指南
# .agent/skills/project_archivist/documents/[project_slug]/interview.md

# Step 4: 创建 Slide HTML
# ⚠️ 必须严格遵循 FF_project_template.html
# src/slides/0X_[project_slug].html

# Step 5: Build & Release
npm run release
```

**关键规则**：
- ✅ **必须**从 `FF_project_template.html` 复制结构
- ❌ **禁止**自创新的 HTML layout
- ✅ 只替换占位符内容，保持所有 class 名称不变

---

### 2️⃣ 更新现有项目 (`/update_project`)

**使用场景**：修改、补充、更新已有项目

**决策树**：
- **小改动**（修错字、微调描述）→ 改 `projects.json` + slide + rebuild
- **中等改动**（新增技术栈、更新 metrics）→ 改 `projects.json` + `architecture.md` + slide + rebuild
- **大改动**（完全重写）→ 使用 `/add_project`，当作新项目处理

---

## 数据管理

### `user_profile.json` 结构

```json
{
  "personal_info": {
    "name": "姓名",
    "title": "职位",
    "mobile": "电话",
    "email": "邮箱",
    "profile_photo": "src/image/profile_photo.png"
  },
  "summary": "个人简介",
  "education": [
    {
      "school": "学校名称",
      "degree": "学位",
      "date": "时间范围"
    }
  ],
  "work_experience": [
    {
      "company": "公司名",
      "role": "职位",
      "date": "时间范围",
      "description": "工作内容（可留空，从 projects.json 自动填充）"
    }
  ],
  "skills": {
    "languages": [...],
    "frameworks": [...],
    "tools": [...]
  }
}
```

### `projects.json` 结构

```json
{
  "project_categories": {
    "category_name": {
      "display_name": "分类显示名",
      "description": "分类描述",
      "projects": [
        {
          "name": "项目名称",
          "role": "你的角色",
          "company": "公司名（必须匹配 user_profile.json）",
          "date": "时间范围",
          "tags": ["tech1", "tech2"],  // ✨ 自动生成 slide 的 tech footer
          "details": {
            "challenge": "挑战",
            "solution": "解决方案",
            "impact": "影响"
          },
          "documents_path": "可选，指向文档路径"
        }
      ]
    }
  }
}
```

**注意**：
- `tags` 字段会**自动生成** slide 的 tech footer（通过 `npm run sync:tags`）
- `tech_stack` 字段已废弃，不再使用

---

## 构建命令

### 开发模式
```bash
# 同步 tech tags（从 projects.json 到 slides）
npm run sync:tags

# 构建 Slide Deck
npm run build

# 构建 One-Page Resume
npm run build:onepage

# 导出 PDF
npm run export
```

### 生产模式
```bash
# 完整流程：sync tags + build + export 所有格式
npm run release
```

---

## 核心规则 (`/.agent/rules/`)

### Template Immutability (模板不可变性)

**Golden Template**: `src/slides/FF_project_template.html`

**强制要求**：
- 🔒 所有项目 slide 必须基于此模板
- ❌ 禁止修改 HTML 结构
- ❌ 禁止创建新的 class 名称
- ❌ 禁止调整元素顺序
- ✅ 只能替换占位符内容

**标准结构**：
```html
<section class="slide">
  <div class="content-wrapper">
    <div class="slide-header-row">
      <h2 class="slide-title">[Title]</h2>
      <span class="slide-tag">[Category]</span>
    </div>
    <div class="star-grid">
      <div class="star-content">
        <!-- 3 STAR cards -->
        <div class="tech-footer">
          <!-- Tech tags -->
        </div>
      </div>
      <div class="star-visual">
        <!-- Image -->
      </div>
    </div>
  </div>
</section>
```

---

## 技能系统 (`/.agent/skills/`)

### Project Archivist
- **功能**: 管理项目数据、生成文档
- **数据源**: `data/projects.json`, `data/user_profile.json`
- **输出**: architecture.md, interview.md

### Resume Generator
- **功能**: 生成 Slide Deck
- **数据源**: `projects.json`
- **输出**: `index.html`

### One-Page Generator
- **功能**: 生成传统履历
- **数据源**: `user_profile.json` + `projects.json`
- **输出**: `resume_onepage.html`

---

## 快速操作指南

### 场景 1：添加新的技术项目
```bash
# 1. 贴上项目资料给 AI
# 2. AI 执行 /add_project
# 3. 自动生成：
#    - projects.json entry
#    - architecture.md
#    - interview.md
#    - slide HTML
#    - rebuild & export PDF
```

### 场景 2：更新个人信息
```bash
# 编辑 user_profile.json
# 修改 name, email, mobile, profile_photo 等
npm run release
```

### 场景 3：添加新的工作经历（非技术）
```bash
# 编辑 user_profile.json 的 work_experience
# 添加新的 entry，description 留空或填写简介
npm run release
```

### 场景 4：修改现有项目内容
```bash
# 使用 /update_project workflow
# AI 会根据修改范围选择性更新文件
```

---

## 文件路径规范

### 图片资源
```
src/image/
├── profile_photo.png      # 个人照片（路径在 user_profile.json）
├── jetson_build.jpg       # 项目配图
├── ansible.png            # 项目配图
└── ...
```

### 项目文档
```
.agent/skills/project_archivist/documents/
├── jetson_bsp/
│   ├── architecture.md
│   └── interview.md
├── ansible/
│   ├── architecture.md
│   └── interview.md
└── ...
```

### Slides
```
src/slides/
├── 00_profile.html        # 个人简介 slide
├── 01_jetson_bsp.html     # 项目 slide
├── 02_ansible.html        # 项目 slide
├── FF_project_template.html  # Golden Template
└── ...
```

---

## 常见问题 (FAQ)

### Q: 如何修改个人照片？
A: 
1. 替换 `src/image/profile_photo.png`
2. 或修改 `user_profile.json` 中的 `profile_photo` 路径
3. 运行 `npm run release`

### Q: 如何调整工作经历顺序？
A: 编辑 `user_profile.json` 的 `work_experience` 数组，按时间倒序排列

### Q: 如何添加非技术工作经历？
A: 在 `user_profile.json` 的 `work_experience` 中添加，`description` 填写工作内容

### Q: PDF 和 HTML 内容不一致？
A: 运行 `npm run release` 确保所有格式同步更新

### Q: Slide 样式错乱？
A: 检查是否严格遵循了 `FF_project_template.html` 结构

---

## 系统状态检查

```bash
# 检查数据完整性
cat .agent/skills/project_archivist/data/user_profile.json
cat .agent/skills/project_archivist/data/projects.json

# 检查 slides
ls -la src/slides/

# 检查输出
ls -la *.html *.pdf

# 重新构建
npm run release
```

---

## 版本信息

- **系统**: Resume Automation System
- **架构**: 数据分离 + 模板系统 + Workflow 驱动
- **最后更新**: 2026-01-29
