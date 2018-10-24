<template>
	<div class="icon" :class="[`icon--${name}`, `icon--${size}`]">
		<svg class="icon-svg">
			<use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'#icon-' + name"></use>
		</svg>
	</div>
</template>

<script>
import './requireIcons.js';

export default {
  props: {
    name: {},
    size: {
      default: 'normal',
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  & .icon-svg {
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: top;
  fill: rgba($color: #9ba9ac, $alpha: 1);
  }
}

</style>

