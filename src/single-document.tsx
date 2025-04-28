import { PlayIcon } from '@sanity/icons';
import { Stack } from '@sanity/ui';
import _getVideoId from 'get-video-id';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import type { ObjectInputProps } from 'sanity';
import { defineField, defineType } from 'sanity';

function YoutubeInput(props: ObjectInputProps) {
  const id = getVideoId(props.value?.url_or_id);
  const muted = props.value?.muted ?? false;

  return (
    <Stack space={4}>
      {id ? (
        <LiteYouTubeEmbed
          title="YouTube Embed" // a11y, always provide a title for iFrames: https://dequeuniversity.com/tips/provide-iframe-titles Help the web be accessible ;)
          id={id}
          muted={muted}
        ></LiteYouTubeEmbed>
      ) : null}
      {props.renderDefault(props)}
    </Stack>
  );
}

export const testDocument = defineType({
  name: 'test',
  title: 'My document',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required().error('Required'),
    }),
    defineField({
      name: 'video',
      type: 'youtube',
      title: 'YouTube Video',
      validation: (Rule) => Rule.required(),
    }),
  ],
});

export const youtubeObject = defineType({
  type: 'object',
  name: 'youtube',
  title: 'YouTube video',
  components: {
    input: YoutubeInput,
  },
  preview: {
    select: {
      url_or_id: 'url_or_id',
    },
    prepare: ({ url_or_id }) => {
      const id = getVideoId(url_or_id);
      const posterImage = id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : undefined;

      return {
        title: 'YouTube',
        subtitle: url_or_id,
        media: () => {
          return (
            <div style={{ display: 'grid' }}>
              {posterImage ? <img style={{ gridArea: '1/1', objectFit: 'cover' }} src={posterImage} alt="" /> : null}
              <PlayIcon
                style={{
                  gridArea: '1/1',
                  zIndex: 1,
                  color: 'white',
                  fontSize: '1.25em',
                  margin: 'auto',
                  filter: 'drop-shadow(0px 0px 3px black)',
                }}
              ></PlayIcon>
            </div>
          );
        },
      };
    },
  },
  fieldsets: [
    {
      name: 'playback_settings',
      title: 'Playback settings',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'url_or_id',
      type: 'string',
      title: 'YouTube URL or ID',
      validation: (Rule) =>
        Rule.required().custom((url_or_id) => {
          if (url_or_id && getVideoId(url_or_id)) {
            return true;
          }
          return 'Invalid YouTube URL or ID';
        }),
    }),
    defineField({
      name: 'loop',
      type: 'boolean',
      title: 'Loop',
      initialValue: false,
      description: 'Video playback restarts automatically when it ends',
      fieldset: 'playback_settings',
    }),
    defineField({
      name: 'muted',
      type: 'boolean',
      title: 'Muted',
      initialValue: false,
      description: 'Video playback starts with the sound turned off',
      fieldset: 'playback_settings',
    }),
    defineField({
      name: 'startsAt',
      type: 'number',
      title: 'Starts at',
      description: 'Starts the video at a specific time in seconds',
      validation: (Rule) => Rule.min(0).integer(),
      initialValue: 0,
      fieldset: 'playback_settings',
    }),
  ],
});

function getVideoId(url_or_id: string | undefined) {
  if (!url_or_id) {
    return undefined;
  }

  if (/^([^#\&\?]{11})$/.test(url_or_id)) {
    return url_or_id;
  }

  const result = _getVideoId(url_or_id);

  if (result && result.service === 'youtube') {
    return result.id;
  }
}
