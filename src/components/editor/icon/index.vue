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
  width: 0.8em;
  height: 0.8em;
  margin: 0 0.3em;

  & .icon-svg {
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: top;
}
}

</style>

