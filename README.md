# flipcard

## 开发

- 安装依赖
```bash
pnpm install
```

- 启动开发环境
```bash
pnpm run dev

pnpm run dev:playground
```

- 打包
```bash
pnpm run build
```

- 发布
```bash
npm login
# 确保版本号已更新
pnpm version patch # 或 minor/major
# 预发布版本
# pnpm version prerelease --preid alpha
# 不触发commit和tag
pnpm version patch --no-git-tag-version
# 批量修改
pnpm -r version patch
# 提交代码
# 发布到 npm
pnpm run publish
```
## 翻页牌（Vue）

```bash
npm install @flipcard/vue
```

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { FlipAnimation } from '@flipcard/vue';
import '@flipcard/vue/dist/style.css';

const value = ref('A');
</script>

<template>
  <FlipAnimation :items="['A', 'B', 'C']" :current-value="value" :sound="true" />
  <button @click="value = value === 'A' ? 'B' : 'A'">翻牌</button>
</template>
```

| Prop | 默认值 | 说明 |
| --- | --- | --- |
| `items` | 字符串 `0` 到 `9` | 可显示的字符串或数字列表 |
| `currentIndex` | 未设置 | 当前索引，优先于 `currentValue` |
| `currentValue` | 未设置 | 当前值，必须与列表中的值及类型一致 |
| `duration` | `600` | 每一步翻牌时长，毫秒；`0` 直接更新；逐张模式最短 32ms |
| `flipMode` | `direct` | `direct` 直接到目标，`sequential` 沿 items 顺序逐张翻动并循环 |
| `flipOrder` | `simultaneous` | `simultaneous` 统一启动，`sequential` 按位置依次启动 |
| `sequenceIndex` | `0` | 当前牌的启动位置，从 0 开始，由父组件传入 |
| `stagger` | `80` | 依次启动的间隔，毫秒；实际延迟为 sequenceIndex × stagger |
| `width` | `60` | 单块宽度，px |
| `height` | `90` | 单块高度，px |
| `fontSize` | `64` | 字号，px |
| `theme` | `dark` | `dark` 或 `light` |
| `respectReducedMotion` | `true` | 跟随系统减少动态效果；playground 默认关闭以完整展示翻牌动画 |
| `paused` | `false` | 暂停，恢复后翻到最新目标值 |
| `sound` | `false` | 开启纸片摩擦和卡片落片声音，需用户点击或键盘操作解锁浏览器音频 |
| `volume` | `0.15` | 音量，`0` 到 `1` |

未指定索引和值时显示列表第一项；无效索引、值或空列表显示空白。页面隐藏、窗口失焦或 Vue KeepAlive 停用时自动暂停，重新激活后显示最新目标值。组件不会创建自动轮播计时器；业务方控制目标值，Vue playground 的计时器在页面未激活时停止。

声音由 Web Audio 合成带起伏的纸片摩擦噪声与短促落片声，每一步都与翻牌中点对齐，并交替使用不同纹理。多块翻页牌共享音频上下文，同帧同速翻牌合并播放，错开启动和连续逐张翻牌保留各自的声音节奏。暂停、关闭声音、卸载时取消未播放的声音。浏览器不支持音频时，翻牌仍然可用。

Vue playground 将字母、时钟、倒计时、机场航班牌和交互卡片拆为独立组件，以纵向视差展示。右侧面板随当前展示区切换，每个示例独立保存配置，重置只影响当前示例。字母可配置 items 与目标值；时钟支持 24H / 12H 切换与 AM / PM 标识；倒计时支持设置秒数、开始、暂停和重置，离开示例或页面后暂停，返回自动继续；航班牌使用自己的航班数据；交互卡片只显示 options.trigger / options.flipped。视口外的示例暂停，支持系统减少动态效果设置。小屏通过浮动按钮打开当前示例的配置面板。航班数据为演示数据。

```bash
pnpm --filter vue dev
pnpm test:playground
```

浏览器测试需要 Playwright Chromium。已有浏览器可通过 `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` 指定路径。

`FlipCardReact` 和 `FlipCardVue` 的 `options` 支持 `trigger: 'hover' | 'click'` 与 `flipped: boolean`，并响应配置更新。React 示例通过 `pnpm --filter react dev` 启动。

本次移除了与翻页组件无关的 `SwitchVue` 导出；此前引用该导出的项目需要改用自己的开关控件。主题样式仍保留。构建完成后可按仓库的发布命令发布，本次修改不执行 npm 发布。

两种顺序可以组合使用。例如一行字符依次启动，同时每个字符沿 items 顺序逐张翻到目标：

```vue
<FlipAnimation
  v-for="(value, index) in values"
  :key="index"
  :items="characters"
  :current-value="value"
  flip-mode="sequential"
  flip-order="sequential"
  :sequence-index="index"
  :stagger="80"
  :duration="100"
  :sound="true"
/>
```

连续翻牌期间，新的目标替换尚未执行的目标；当前一步先完成，再继续追向最新值。等待依次启动的牌也更新到最新目标，但不重新延后启动，避免持续更新导致后面的牌一直等待。空列表和无效值不逐张循环。两种模式及其时序参数均可在 playground 控制面板调整。

航班牌按状态显示颜色：登机绿色、准点米白、等待琥珀色，颜色作用于状态文字，牌面保持深色；背景与普通文字也可在航班专属面板修改。FlipAnimation 支持 CSS 变量 `--flip-background` 和 `--flip-color`，可在父元素按业务状态设置背景和文字颜色，深浅主题均可使用。

playground 的字母示例使用四块联动牌。选择 flipMode / flipOrder 后，点击「演示当前翻牌行为」可跨多个值观察直接、逐张以及统一、依次启动的区别；演示会暂停自动播放，避免过程中持续改变目标。单块牌或只变化一个相邻字符时，这些模式的区别并不明显。playground 默认完整播放翻牌动画；勾选 respectReducedMotion 后遵循系统减少动态效果设置。

每个示例下方都有「组件使用示例」，代码随当前配置更新，可复制为独立 `.vue` 文件。五种示例包含 npm 包导入、所需样式、目标值更新和各自布局；时钟示例包含计时器暂停、恢复及卸载清理。

航班配色参考实体翻页牌的深色牌面与浅色字符风格，状态文字的绿色、米白、琥珀色是本示例的设计选择。参考：[翻页牌制造商机场场景案例](https://www.flapdisplay.com/index.php/2026/07/06/lastcall-split-flap-picture-flap-display-hamad-airport/)。

## Playground 自动部署

`.github/workflows/node.js.yml` 在推送到 `main`、向 `main` 提交 PR 或手动运行时安装依赖，构建组件包，运行包测试及 Chromium 浏览器回归测试，并构建 playground。只有 `main` 分支的推送和手动运行会部署 Vue playground，PR 只执行检查。

首次启用时，在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。随后推送到 `main`，或在 **Actions → CI and Playground Pages → Run workflow** 手动运行。部署完成后，工作流的 `github-pages` 环境会显示访问地址；本仓库当前 Pages 地址为 http://blog.chenbitao.com/flipcard/，最终地址以部署环境输出为准。

部署产物为 `playground/vue/dist`，无需提交构建文件或维护 `gh-pages` 分支。Vite 使用相对资源路径 `base: './'`，可以在 `/flipcard/` 项目路径及自定义域名下加载资源。部署使用 GitHub 提供的 `GITHUB_TOKEN`，无需添加个人令牌。
